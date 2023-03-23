"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teams_fields_1 = require("../controllers/teams_fields");
/**
 * * Base route: /fields
 */
const router = express_1.default.Router({
    mergeParams: true
});
router.get('/', teams_fields_1.getAllTeamsFields);
router.post('/', teams_fields_1.createTeamsField);
router.get('/:team', teams_fields_1.getTeamsFields);
router.get('/:team/:id', teams_fields_1.getTeamsField);
router.delete('/:id', teams_fields_1.deleteTeamsField);
router.patch('/:id', teams_fields_1.updateTeamsField);
exports.default = router;
