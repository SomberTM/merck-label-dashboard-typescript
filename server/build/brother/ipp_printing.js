"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendLabelsToPrinter = exports.formatPrinterURL = void 0;
const jimp_1 = __importDefault(require("jimp"));
const printer_1 = require("./printer");
const raster_1 = require("./raster");
function formatPrinterURL(printer) {
    return `http://${printer.ip}:631/ipp/print`;
}
exports.formatPrinterURL = formatPrinterURL;
function sendLabelsToPrinter(base64labels, printer) {
    return __awaiter(this, void 0, void 0, function* () {
        const brotherPrinter = new printer_1.BrotherQLPrinter(formatPrinterURL(printer));
        const printerAttributes = yield brotherPrinter.getAttributes();
        // Printer took too long to respond or we couldnt connect
        if (printerAttributes === undefined) {
            return false;
        }
        // @ts-ignore
        const mediaName = printerAttributes['printer-attributes-tag']['media-ready'];
        var [width, length] = RegExp(/(\d+)x(\d+)/)
            .exec(mediaName)
            .slice(1)
            .map(Number);
        length = length == 0 ? 100 : length;
        const images = [];
        for (const base64label of base64labels) {
            images.push(yield jimp_1.default.read(Buffer.from(base64label, 'base64')));
        }
        const raster = new raster_1.BrotherQLRaster({
            media: {
                width,
                length,
                type: 'DieCut',
            },
            images: images,
        }).addAll();
        const buffer = raster.buildBuffer();
        const success = yield brotherPrinter.print(buffer);
        return success !== null && success !== void 0 ? success : false;
    });
}
exports.sendLabelsToPrinter = sendLabelsToPrinter;
