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
exports.updateLabel = exports.deleteLabel = exports.printLabels = exports.generateLabelImage = exports.createLabel = exports.getLabel = exports.getAllLabels = void 0;
const db_1 = __importDefault(require("../db"));
const label_generation_1 = require("../brother/label_generation");
const ipp_printing_1 = require("../brother/ipp_printing");
const getAllLabels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team, width, length } = req.query;
        if (team && !(width || length)) {
            const labels = yield db_1.default.label.findMany({
                where: {
                    team_name: team,
                },
            });
            return res.status(200).json(labels);
        }
        if (team && width && length) {
            const labels = yield db_1.default.label.findMany({
                where: {
                    team_name: team,
                    width: Number(width),
                    length: Number(length),
                },
            });
            return res.status(200).json(labels);
        }
        const labels = yield db_1.default.label.findMany();
        const teams = yield db_1.default.team.findMany();
        const groupedByTeam = {};
        for (const { name } of teams) {
            groupedByTeam[name] = labels.filter((label) => label.team_name == name);
        }
        res.status(200).json(groupedByTeam);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.getAllLabels = getAllLabels;
const getLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const label = yield db_1.default.label.findUnique({
            where: {
                id: Number(id),
            },
        });
        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` });
        }
        res.status(200).json(label);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.getLabel = getLabel;
const createLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team_name, width, length, name, data } = req.body;
        if (!team_name || !width || !length || !name) {
            return res.status(400).json({
                message: 'To create a new label layout, you must specify the team name, width, length, name, and data of the label',
            });
        }
        const label = yield db_1.default.label.create({
            data: {
                team_name,
                name,
                width,
                length,
                data: data !== null && data !== void 0 ? data : {},
            },
        });
        res.status(201).json(label);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.createLabel = createLabel;
const generateLabelImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        var { sample_id, layout_id } = req.body;
        const sample = yield db_1.default.sample.findFirst({
            where: {
                id: sample_id,
            },
        });
        if (sample == null) {
            return res
                .status(404)
                .json({ message: `No sample found with id "${sample_id}"` });
        }
        const labelLayout = yield db_1.default.label.findUnique({
            where: {
                id: layout_id,
            },
        });
        if (labelLayout == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${layout_id}"` });
        }
        try {
            const label = yield (0, label_generation_1.generateLabelImageWithLayoutAndSample)(labelLayout, sample);
            const base64 = (yield label.toBuffer()).toString('base64');
            res.status(200).json(base64);
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.generateLabelImage = generateLabelImage;
const printLabels = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { images, printer } = req.body;
        try {
            const success = yield (0, ipp_printing_1.sendLabelsToPrinter)(images, printer);
            res.status(200).json({ success });
        }
        catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.printLabels = printLabels;
const deleteLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const label = yield db_1.default.label.delete({
            where: {
                id: Number(id),
            },
        });
        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` });
        }
        res.status(200).json(label);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.deleteLabel = deleteLabel;
const updateLabel = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { team_name, width, length, name, data } = req.body;
        const label = yield db_1.default.label.update({
            where: {
                id: Number(id),
            },
            data: {
                team_name,
                name,
                width,
                length,
                data: data !== null && data !== void 0 ? data : {},
            },
        });
        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` });
        }
        res.status(200).json(label);
    }
    catch (e) {
        console.log(e);
        res.status(500).json({ message: e.message });
    }
});
exports.updateLabel = updateLabel;
