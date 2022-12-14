import { generateHashKey, generateLabel } from "../brother/qr";
import { printLabel } from "../brother/print";
import prisma, { Printer, Sample } from "../db";

const labelCache: { [key: string]: string } = {};

async function createQRCodeKey(req: any, res: any) {
    const sample: Omit<Sample, 'qr_code_key'> = req.body;
    try {
        const hashKey = generateHashKey(sample);
        res.status(201).json({ qr_code_key: hashKey });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function createQRCodeLabel(req: any, res: any) {
    const sample: Sample = req.body;
    try {
        if (labelCache[sample.qr_code_key]) {
            res.status(201).json({ qr_code_image: labelCache[sample.qr_code_key] });
        } else {
            const labelImage = await generateLabel(sample)
            const buffer = await labelImage.getBufferAsync('image/png')
            const base64 = buffer.toString('base64')
            labelCache[sample.qr_code_key] = base64;
            res.status(201).json({ qr_code_image: base64 });
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function printQRCodeLabel(req: any, res: any) {
    const data = req.body;
    const base64label = data.base64label;
    const printer: Printer = data.printer;
    try {
        const success = await printLabel(base64label, printer)
        res.status(200).json({ success });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
}

async function getPrinters(req: any, res: any) {
    const printers = await prisma.printers.findMany()
    res.status(200).json(printers)
}


export {
    createQRCodeKey,
    createQRCodeLabel,
    getPrinters,
    printQRCodeLabel
}