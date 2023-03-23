import Jimp from 'jimp'
import prisma from '../db'
import { BrotherQLPrinter } from './printer'
import { BrotherQLRaster, BrotherQLRasterImages } from './raster'
import { Printer } from '@prisma/client'
import sharp, { Sharp } from 'sharp'

export function formatPrinterURL(printer: Printer) {
    return `http://${printer.ip}:631/ipp/print`
}

export async function sendLabelsToPrinter(
    base64labels: string[],
    printer: Printer
) {
    const brotherPrinter = new BrotherQLPrinter(formatPrinterURL(printer))
    const printerAttributes = await brotherPrinter.getAttributes()

    // Printer took too long to respond or we couldnt connect
    if (printerAttributes === undefined) {
        return false
    }

    // @ts-ignore
    const mediaName: string =
        printerAttributes['printer-attributes-tag']['media-ready']
    var [width, length] = RegExp(/(\d+)x(\d+)/)
        .exec(mediaName)!
        .slice(1)
        .map(Number)
    length = length == 0 ? 100 : length

    const images: Jimp[] = []
    for (const base64label of base64labels) {
        images.push(await Jimp.read(Buffer.from(base64label, 'base64')))
    }

    const raster = new BrotherQLRaster({
        media: {
            width,
            length,
            type: 'DieCut',
        },
        images: images as BrotherQLRasterImages,
    }).addAll()

    const buffer = raster.buildBuffer()

    const success = await brotherPrinter.print(buffer)

    return success ?? false
}
