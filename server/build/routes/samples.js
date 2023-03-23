"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const samples_1 = require("../controllers/samples");
/**
 * * Base route: /:team/samples
 */
const router = express_1.default.Router({
    mergeParams: true
});
router.get("/", samples_1.getSamples);
router.post("/", samples_1.createSample);
router.patch("/:id", samples_1.updateSample);
router.delete("/:id", samples_1.deleteSample);
router.delete("/", samples_1.deleteSamples);
// Dillema: Should id be the sample id or the audit id?
// For now it will be sample id.
router.get("/:id/audit", samples_1.getAuditTrail);
// Clashes with the getSample route
// router.get('/deleted', getDeletedSamples);
exports.default = router;
