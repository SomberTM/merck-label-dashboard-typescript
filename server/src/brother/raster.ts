import Jimp from 'jimp'

export type BrotherQLMediaType = 'DieCut' | 'Continuous'

export interface BrotherQLMediaInfo {
    width: number
    length: number
    type: BrotherQLMediaType
}

export type BrotherQLRasterImages = { 0: Jimp } & Jimp[]

export interface BrotherQLRasterOptions {
    media: BrotherQLMediaInfo
    images: BrotherQLRasterImages // Array of at least 1 Jimp image
    prioritizeQuality?: boolean
    dpi600?: boolean
    twoColorPrinting?: boolean
    autocut?: boolean
    cutAtEnd?: boolean
    cutEvery?: number
    compression?: boolean
}

type RequiredKeys = 'media' | 'images'
type RequiredOptionals = Required<Omit<BrotherQLRasterOptions, RequiredKeys>>

const DefaultOptionals: RequiredOptionals = {
    prioritizeQuality: false,
    dpi600: false,
    twoColorPrinting: false,
    autocut: true,
    cutAtEnd: true,
    cutEvery: 1,
    compression: false,
}

const int = (bool: boolean): 0 | 1 => {
    return bool ? 1 : 0
}

export class BrotherQLRaster {
    private chunks: Buffer[]
    private options: Required<BrotherQLRasterOptions>
    private page: number = 0

    constructor(options: BrotherQLRasterOptions) {
        this.options = Object.assign({}, DefaultOptionals, options)
        this.chunks = []
    }

    /**
     * Converts a label size in millimeters to its equivalent in pixels given
     * the DPI of the printer.
     * @param mmWidth
     * @param mmLength
     * @param dpi
     * @returns
     */
    public static convertToPixels(
        mmWidth: number,
        mmLength: number,
        dpi: number = 300
    ): [number, number] {
        const inWidth = mmWidth / 25.4
        const inLength = mmLength / 25.4
        const aspectRatio =
            mmWidth > mmLength ? mmWidth / mmLength : mmLength / mmWidth
        const diagonalLength =
            dpi * Math.sqrt(Math.pow(inWidth, 2) + Math.pow(inLength, 2))
        const length = diagonalLength / Math.sqrt(1 + Math.pow(aspectRatio, 2))
        const width =
            diagonalLength / Math.sqrt(1 + Math.pow(1 / aspectRatio, 2))
        return [width, length]
    }

    public addInvalidate(): BrotherQLRaster {
        this.chunks.push(Buffer.alloc(400))
        return this
    }

    public addInitialize(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1b, 0x40]))
        return this
    }

    public switchToRasterMode(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x61, 0x01]))
        return this
    }

    public sendAutomaticStatusNotification(
        notify: boolean = false
    ): BrotherQLRaster {
        // normally false = notify, true = don't notify so we invert it
        // this.chunks.push(Buffer.from([0x1b, 0x69, 0x21, int(!notify)]));
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x21, 0x00]))
        return this
    }

    public addMediaTypeAndQuality(
        media?: BrotherQLMediaInfo,
        prioritizeQuality?: boolean
    ): BrotherQLRaster {
        var validFlags = 0x80

        const _media = media ?? this.options.media
        const _prioritizeQuality =
            prioritizeQuality || this.options.prioritizeQuality

        validFlags |= int(_media.type !== undefined) << 1
        validFlags |= int(_media.width !== undefined) << 2
        validFlags |= int(_media.length !== undefined) << 3
        validFlags |=
            int(_prioritizeQuality && !this.options.twoColorPrinting) << 6

        this.chunks.push(
            Buffer.from([
                0x1b,
                0x69,
                0x7a,
                validFlags,
                _media.type == 'DieCut' ? 0x0b : 0x0a,
                _media.width,
                _media.length,
                0xdf,
                0x03,
                0x00,
                0x00,
                this.page,
                0x00,
            ])
        )

        this.page++
        return this
    }

    public addAutoCut(autocut?: boolean, cutEvery?: number): BrotherQLRaster {
        const _autocut = autocut ?? this.options.autocut
        const _cutEvery: number = cutEvery ?? this.options.cutEvery
        // specify autocut
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x4d, int(_autocut) << 6]))
        // specify cut each n labels
        this.chunks.push(Buffer.from([0x1b, 0x69, 0x41, _cutEvery!]))
        return this
    }

    public addExpandedModeOptions(
        twoColor?: boolean,
        cutAtEnd?: boolean,
        highRes?: boolean
    ): BrotherQLRaster {
        const _twoColor = twoColor ?? this.options.twoColorPrinting
        const _cutAtEnd = cutAtEnd ?? this.options.cutAtEnd
        const _highRes = highRes ?? this.options.dpi600
        this.chunks.push(
            Buffer.from([
                0x1b,
                0x69,
                0x4b,
                (int(_twoColor && !this.options.prioritizeQuality) << 0) |
                    (int(_cutAtEnd) << 3) |
                    (int(_highRes) << 6),
            ])
        )
        return this
    }

    public addMargins(n1?: number, n2?: number): BrotherQLRaster {
        this.chunks.push(
            Buffer.from([0x1b, 0x69, 0x64, n1 ?? 0x00, n2 ?? 0x00])
        )
        return this
    }

    public addCompression(compression?: boolean): BrotherQLRaster {
        const _compression = compression ?? this.options.compression
        this.chunks.push(Buffer.from([0x4d, _compression ? 0x02 : 0x00]))
        return this
    }

    public addRasterData(image: Jimp, marginTop?: number): BrotherQLRaster {
        const labelLength = this.options.media.length
        const labelWidth = this.options.media.width

        // convert to pixels but a little too large
        const [widthpx, lengthpx] = BrotherQLRaster.convertToPixels(
            labelLength,
            labelWidth,
            this.options.dpi600 ? 600 : 300
        )

        // Even the conversion is a little too large so we take away a little
        // buffer to make sure the image is not too large and over fills the label
        const pixelConversionBuffer = 100

        if (labelLength != 0)
            image.resize(
                widthpx - pixelConversionBuffer,
                lengthpx - pixelConversionBuffer
            )

        image.greyscale().contrast(1)

        if (image.bitmap.width > image.bitmap.height) image.rotate(90)

        const bufferSize = labelLength + 3

        if (!marginTop) marginTop = Math.ceil(labelWidth / 3)

        for (let y = 0; y < image.bitmap.height; y++) {
            let row = Buffer.alloc(bufferSize)
            row[0] = 0x67
            row[1] = 0x00
            row[2] = labelLength
            for (let x = 0; x < image.bitmap.width; x++) {
                if (image.getPixelColor(x, y) == 255) {
                    // 90 bytes per raster row, 8 pixels per byte
                    let byteNum = 90 - Math.floor(x / 8)
                    let bitOffset = x % 8
                    row[byteNum] |= 1 << bitOffset
                }
            }
            if (this.options.compression) {
                // use TIFF (pack bits) compression on the row
            }
            this.chunks.push(row)
        }

        return this
    }

    public addPageEnd(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x0c]))
        return this
    }

    public addEndRaster(): BrotherQLRaster {
        this.chunks.push(Buffer.from([0x1a]))
        return this
    }

    public addAll() {
        this.addInvalidate()
            .addInitialize()
            .switchToRasterMode()
            .sendAutomaticStatusNotification()
            .addMediaTypeAndQuality()
            .addAutoCut()
            .addExpandedModeOptions()
            .addMargins()
            .addCompression()

        for (let l, i = 0; i < (l = this.options.images.length); i++) {
            this.addRasterData(this.options.images[i])

            if (i < l - 1) this.addPageEnd()
            else this.addEndRaster()
        }

        return this
    }

    public buildBuffer(): Buffer {
        return Buffer.concat(this.chunks)
    }
}
