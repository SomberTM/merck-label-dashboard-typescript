import QRCode from 'qrcode'

import sharp, { Sharp } from 'sharp'

import { Label, Sample } from '@prisma/client'

import { DateTime } from 'luxon'

/**
 * Generates a hash key from the given sample, then generates a QR code from that hash key and feeds that to Jimp to generate the QR Image
 * @param sample
 * @returns
 */
async function generateQRCodeImage(
    qrCodeData: string,
    size?: { width: number; height: number }
): Promise<Buffer> {
    return await QRCode.toBuffer(qrCodeData, {
        ...(size ?? {}),
        type: 'png',
        margin: 0,
        errorCorrectionLevel: 'H',
    })
}

type LabelLayoutDataType = {
    text: string
    textSize: number
    bold: boolean
    italic: boolean
    position: {
        x: number
        y: number
    }
}

export async function generateLabelImageWithLayoutAndSample(
    layout: Label,
    sample: Sample
): Promise<Sharp> {
    // We are provided with the label size in mm, but we need to convert it to pixels
    // Generally, computer screens have a dpi of 96, so we divide by 25.4 to get the number of pixels per mm
    // We can then use this dpi factor to convert the mm to pixels
    const dpiFactor = 96 / 25.4

    // Length of the label is measured in mm in the horizontal direction
    const width = Math.ceil(layout.length * dpiFactor)

    // Width of the label is measured in mm in the vertical direction
    const height = Math.ceil(layout.width * dpiFactor)

    const entityData = layout.data as LabelLayoutDataType[]

    const qrCodeEntity = entityData.find((entity) => entity.text === '')
    var qrCodeBuffer: Buffer | undefined = undefined
    if (qrCodeEntity !== undefined) {
        var qrCodeSize = qrCodeEntity?.textSize ?? 50
        qrCodeBuffer = await generateQRCodeImage(sample.audit_id, {
            width: qrCodeSize,
            height: qrCodeSize,
        })
    }

    // This will hold all the styling information for our text
    // Here you can use all the CSS properties you would normally use in a stylesheet
    var svgStyles = `<style>\n`

    // This will hold all the text elements
    var svgText = ``

    // These are the base styles for all the text
    const baseStyle = `.base {\nfill: #001;\nfont-family: "Arial, Helvetica, sans-serif";\n} `

    // These are the styles for the bold and italic text
    const boldStyle = `.bold {\nfont-weight: bold;\n} `
    const italicStyle = `.italic {\nfont-style: italic;\n} `

    svgStyles += baseStyle + boldStyle + italicStyle

    for (let i = 0; i < entityData.length; i++) {
        var { text, position, textSize, bold, italic } = entityData[i]

        // If the text is empty, then we skip it
        // This is because the QR code entity has an empty text
        if (text === '') continue

        const { x, y } = position

        // This matches the anything surrounded by curly braces in the text
        // For example, if the text is "Hello {name}", then the matched array will be ["{name}", "name"]
        const matched = text.match(/{(\w+)}/)

        // If we get a match, we want to replace the matched text with the value of the key in the sample object
        if (matched) {
            const key: string = <string>matched[1]

            // We first check if the key exists in the sample object
            // If it doesnt, then we check if the key exists in the data field of the sample object
            // If it doesnt, then we set the value to "N/A"
            var value = sample[key] ?? sample.data?.[key] ?? 'N/A'

            if (key.includes('date')) {
                try {
                    // The 3 dates on every sample will be JS Dates since they are handled by prisma
                    value = DateTime.fromJSDate(value).toFormat('MM/dd/yyyy')
                } catch (e) {
                    try {
                        // Any dates specified in the data field of the sample will be ISO strings.
                        value = DateTime.fromISO(value).toFormat('MM/dd/yyyy')
                    } catch (e) {
                        value = 'Unknown Date'
                    }
                }
            }

            text = text.replace(matched[0], value)
        }

        // This is the class name for the font size
        // For example, if the text size is 12, then the class name will be fontSize12
        // This is used to avoid having to specify the font size for every text element
        // And we can reuse the same class for text elements with the same size
        const fontSizeClassName = `fontSize${textSize}`

        // If we dont already have a style for the font size, then we add it to the style tag
        if (!svgStyles.includes(`.${fontSizeClassName}`)) {
            svgStyles += `.${fontSizeClassName} {\nfont-size: ${textSize};\n} `
        }

        // This is the class name for the text element
        const clazz = `base${bold ? ' bold' : ''}${
            italic ? ' italic' : ''
        } ${fontSizeClassName}`.trim()

        // We add the text element to the text tag
        // For the y component of the position, we add the text size to the y position
        // Since, I believe, the text is rendered from the bottom left corner
        // prettier-ignore
        svgText += `<text x="${x}" y="${y + textSize}" class="${clazz}">${text}</text>\n`
    }

    // Close our styles tag
    svgStyles += `\n</style>`

    // I used a lot of \n so that the generated SVG is easier to read and looks somewhat nice
    const svg = `<svg width="${width}" height="${height}">\n${svgStyles}\n${svgText}</svg>`
    const svgBuffer = Buffer.from(svg)

    // We use sharp to composite the SVG and QR code on top of a white background.
    // We also convert the image to grayscale since the label printer only prints in black and white
    // and force the output to png since we need a raster image to generate the raster data for the printer.

    if (qrCodeBuffer === undefined) {
        return sharp({
            create: {
                width,
                height,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 },
            },
        })
            .composite([
                {
                    input: svgBuffer,
                    top: 0,
                    left: 0,
                },
            ])
            .grayscale()
            .png()
    }

    return sharp({
        create: {
            width,
            height,
            channels: 4,
            background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
    })
        .composite([
            {
                input: svgBuffer,
                top: 0,
                left: 0,
            },
            {
                input: qrCodeBuffer,
                top: qrCodeEntity!.position.y,
                left: qrCodeEntity!.position.x,
            },
        ])
        .grayscale()
        .png()
}
