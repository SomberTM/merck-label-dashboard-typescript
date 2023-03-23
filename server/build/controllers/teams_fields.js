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
exports.updateTeamsField = exports.deleteTeamsField = exports.createTeamsField = exports.getTeamsField = exports.getTeamsFields = exports.getAllTeamsFields = void 0;
const db_1 = __importDefault(require("../db"));
// TODO:
// - Possibly add a route that returns all fields grouped by team.
const getAllTeamsFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fields = yield db_1.default.teamField.findMany();
        const teams = yield db_1.default.team.findMany();
        const fieldsGroupedByTeam = {};
        for (const team of teams) {
            fieldsGroupedByTeam[team.name] = fields.filter((field) => field.team_name === team.name);
        }
        res.status(200).json(fieldsGroupedByTeam);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.getAllTeamsFields = getAllTeamsFields;
/**
 * Given a team name (through the route params), returns (responds with) all the fields that are in use by that team.
 * @param req
 * @param res
 * @returns
 */
const getTeamsFields = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team: teamName } = req.params;
        const team = yield db_1.default.team.findUnique({
            where: {
                name: teamName,
            },
        });
        if (!team)
            return res
                .status(404)
                .json({ message: `No team with name "${teamName}" was found` });
        const fields = yield db_1.default.teamField.findMany({
            where: {
                team_name: teamName,
            },
        });
        res.status(200).json(fields);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.getTeamsFields = getTeamsFields;
/**
 * Gets a specific field from a specific team.
 * @param req
 * @param res
 * @returns
 */
const getTeamsField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team, id } = req.params;
        const field = yield db_1.default.teamField.findUnique({
            where: {
                id: parseInt(id),
            },
        });
        if (!field)
            return res.status(404).json({
                message: `No field with id "${id}" was found on team "${team}"`,
            });
        res.status(200).json(field);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.getTeamsField = getTeamsField;
const createTeamsField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { team_name, name, display_name } = req.body;
        const field = yield db_1.default.teamField.create({
            data: {
                name,
                display_name,
                team_name,
            },
        });
        res.status(201).json(field);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.createTeamsField = createTeamsField;
const deleteTeamsField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const deletedField = yield db_1.default.teamField.delete({
            where: {
                id: parseInt(id),
            },
        });
        res.status(200).json(deletedField);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.deleteTeamsField = deleteTeamsField;
const updateTeamsField = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, display_name } = req.body;
        const updatedField = yield db_1.default.teamField.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                display_name,
            },
        });
        res.status(200).json(updatedField);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
exports.updateTeamsField = updateTeamsField;
