"use strict";
// Teams can have multiple labels at different sizes
// Current idea is that only one label per size can be active at a time
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const teams_labels_1 = require("../controllers/teams_labels");
const router = express_1.default.Router({
    mergeParams: true,
});
router.get('/', teams_labels_1.getAllLabels);
router.post('/generate', teams_labels_1.generateLabelImage);
router.post('/print', teams_labels_1.printLabels);
router.post('/', teams_labels_1.createLabel);
router.get('/:id', teams_labels_1.getLabel);
router.patch('/:id', teams_labels_1.updateLabel);
router.delete('/:id', teams_labels_1.deleteLabel);
exports.default = router;
