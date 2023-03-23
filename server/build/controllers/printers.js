"use strict";
/**
 * base route /printers
 * - create
 * - delete
 * - get
 * - update
 */
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
exports.updatePrinter = exports.deletePrinter = exports.createPrinter = exports.getPrinter = exports.getPrinters = void 0;
const db_1 = __importDefault(require("../db"));
const getPrinters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const printers = yield db_1.default.printer.findMany();
    res.status(200).json(printers);
});
exports.getPrinters = getPrinters;
const getPrinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip } = req.params;
    const printer = yield db_1.default.printer.findUnique({
        where: {
            ip,
        },
    });
    if (!printer)
        return res.status(404).json({ message: `Printer "${ip}" not found` });
    res.status(200).json(printer);
});
exports.getPrinter = getPrinter;
const createPrinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip, name, location } = req.body;
    const printer = yield db_1.default.printer.create({
        data: {
            ip,
            name,
            location,
        },
    });
    res.status(201).json(printer);
});
exports.createPrinter = createPrinter;
const deletePrinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip } = req.params;
    const printer = yield db_1.default.printer.delete({
        where: {
            ip,
        },
    });
    if (!printer)
        return res.status(404).json({ message: `Printer "${ip}" not found` });
    res.status(200).json(printer);
});
exports.deletePrinter = deletePrinter;
const updatePrinter = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ip } = req.params;
    const { ip: newIP, name, location } = req.body;
    const printer = yield db_1.default.printer.update({
        where: {
            ip,
        },
        data: {
            ip: newIP,
            name,
            location,
        },
    });
    res.status(200).json(printer);
});
exports.updatePrinter = updatePrinter;
