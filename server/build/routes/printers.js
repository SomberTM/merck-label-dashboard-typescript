"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const printers_1 = require("../controllers/printers");
const router = express_1.default.Router({
    // Allows us to acces the team parameter from the controllers below
    mergeParams: true
});
router.get('/', printers_1.getPrinters);
router.get('/:ip', printers_1.getPrinter);
router.post('/', printers_1.createPrinter);
router.delete('/:ip', printers_1.deletePrinter);
router.patch('/:ip', printers_1.updatePrinter);
exports.default = router;
