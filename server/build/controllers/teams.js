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
exports.updateTeam = exports.deleteTeam = exports.createTeam = exports.getTeams = void 0;
const db_1 = __importDefault(require("../db"));
const getTeams = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teams = yield db_1.default.team.findMany();
        res.status(200).json(teams);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.getTeams = getTeams;
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.body;
        const team = yield db_1.default.team.create({
            data: {
                name,
            },
        });
        res.status(200).json(team);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.createTeam = createTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        try {
            const team = yield db_1.default.team.delete({
                where: {
                    name,
                },
            });
            if (!team)
                return res
                    .status(404)
                    .json({ message: `No team with name "${name}" was found` });
            res.status(200).json(team);
        }
        catch (err) {
            console.error(err);
            res.status(500).json({ message: err.message });
        }
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.deleteTeam = deleteTeam;
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.params;
        const { name: newName } = req.body;
        const team = yield db_1.default.team.update({
            where: {
                name,
            },
            data: {
                name: newName,
            },
        });
        if (!team)
            return res
                .status(404)
                .json({ message: `No team with name "${name}" was found` });
        res.status(200).json(exports.updateTeam);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});
exports.updateTeam = updateTeam;
