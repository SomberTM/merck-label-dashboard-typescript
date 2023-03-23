"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teams_1 = require("../controllers/teams");
const router = express_1.default.Router({
    mergeParams: true
});
router.get('/', teams_1.getTeams);
router.post('/', teams_1.createTeam);
router.patch('/:name', teams_1.updateTeam);
router.delete('/:name', teams_1.deleteTeam);
exports.default = router;
