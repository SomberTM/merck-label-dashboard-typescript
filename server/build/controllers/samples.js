"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSamples = exports.deleteSample = exports.updateSample = exports.createSample = exports.getDeletedSamples = exports.getAuditTrail = exports.getSamples = void 0;
const db_1 = __importStar(require("../db"));
const email_1 = require("../email");
/**
 * Base route /:team/samples
 */
// [x] create
// [x] delete
// [x] update
// [x] get all /:team/samples
// [x] get one /:team/samples/:id
// Need to think of a different route for this.
// Currently clashes with get one sample
// [~] get deleted, route: /:team/samples/deleted
// [x] get history, route: /:team/samples/:id/audit
const getSamples = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, team } = req.query;
    /* Handles the case where have both an id and team. We get the sample with given id from the given team */
    if (id !== undefined && team != undefined) {
        const teamExists = yield (0, db_1.doesTeamExist)(team);
        if (!teamExists)
            return res.status(404).json({ message: `Team "${team}" not found` });
        const sample = yield db_1.default.sample.findFirst({
            where: {
                id,
                team_name: team,
            },
        });
        if (!sample)
            return res
                .status(404)
                .json({ message: `Sample "${id}" not found in team "${team}"` });
        // If this samples audit id is in the deleted table, then it is deleted
        const isDeleted = yield db_1.default.deleted.findFirst({
            where: {
                audit_id: sample.audit_id,
            },
        });
        if (isDeleted !== null)
            return res.status(404).json({ message: `Sample "${id}" not found` });
        res.status(200).json(sample);
    }
    else if (id !== undefined) {
        /** Handles the case where we only have the id. Searches all teams for the sample with the given id */
        const sample = yield db_1.default.sample.findUnique({
            where: {
                id: id,
            },
        });
        if (!sample)
            return res
                .status(404)
                .json({ message: `Sample "${id}" not found in any team` });
        // If this samples audit id is in the deleted table, then it is deleted
        const isDeleted = yield db_1.default.deleted.findFirst({
            where: {
                audit_id: sample.audit_id,
            },
        });
        if (isDeleted !== null)
            return res.status(404).json({ message: `Sample "${id}" not found` });
        res.status(200).json(sample);
    }
    else if (team !== undefined) {
        /** Handles the case where only the team is provided. Gets all the samples for the provided team */
        const teamExists = yield (0, db_1.doesTeamExist)(team);
        if (!teamExists)
            return res.status(404).json({ message: `Team "${team}" not found` });
        const deletedAuditIDs = (yield db_1.default.deleted.findMany())
            .filter((group) => group.team_name === team)
            .map((group) => group.audit_id);
        // Now we want to get the newest audit number for each audit id that is not deleted
        const newestNonDeletedSamples = (yield db_1.default.sample.groupBy({
            by: ['audit_id'],
            where: {
                team_name: team,
                audit_id: {
                    notIn: deletedAuditIDs,
                },
            },
            _max: {
                audit_number: true,
            },
        })).map((group) => {
            return {
                audit_id: group.audit_id,
                audit_number: group._max.audit_number,
            };
        });
        // Now we can get all the newest versions of samples that arent deleted
        const samples = yield db_1.default.sample.findMany({
            where: {
                OR: newestNonDeletedSamples,
            },
        });
        res.status(200).json(samples);
    }
    else {
        /** Handles the case where no id or team are provided. Returns all samples grouped by team */
        const deletedAuditIDs = (yield db_1.default.deleted.findMany()).map((group) => group.audit_id);
        const sampleGroups = (yield db_1.default.sample.groupBy({
            by: ['team_name', 'audit_id'],
            _max: {
                audit_number: true,
            },
        }))
            .filter((group) => !deletedAuditIDs.includes(group.audit_id))
            .map((group) => {
            return {
                team_name: group.team_name,
                audit_id: group.audit_id,
                audit_number: group._max.audit_number,
            };
        });
        const samples = yield db_1.default.sample.findMany({
            where: {
                OR: sampleGroups,
            },
        });
        const groupedByTeam = {};
        // If a team has no samples it wont show up in the groupedByTeam object
        // But we want it to show up as an empty array so we can show the team exists
        // So we get all teams and initialize their arrays
        const teams = yield db_1.default.team.findMany();
        for (const team of teams) {
            groupedByTeam[team.name] = [];
        }
        for (const sample of samples) {
            if (!groupedByTeam[sample.team_name]) {
                groupedByTeam[sample.team_name] = [];
            }
            groupedByTeam[sample.team_name].push(sample);
        }
        res.status(200).json(groupedByTeam);
    }
});
exports.getSamples = getSamples;
const getAuditTrail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const sample = yield db_1.default.sample.findUnique({
        where: {
            id,
        },
        select: {
            audit_id: true,
        },
    });
    if (!sample)
        return res.status(404).json({ message: `Sample "${id}" not found` });
    const auditTrail = yield db_1.default.sample.findMany({
        where: {
            audit_id: sample.audit_id,
        },
    });
    // Make the highest audit number first (newest)
    auditTrail.sort((a, b) => b.audit_number - a.audit_number);
    res.status(200).json(auditTrail);
});
exports.getAuditTrail = getAuditTrail;
const getDeletedSamples = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedSamples = (yield db_1.default.deleted.findMany()).map((del) => del.audit_id);
    const samplesGroups = (yield db_1.default.sample.groupBy({
        by: ['audit_id'],
        where: {
            audit_id: {
                in: deletedSamples,
            },
        },
        _max: {
            audit_number: true,
        },
    })).map((group) => {
        return {
            audit_id: group.audit_id,
            audit_number: group._max.audit_number,
        };
    });
    const newestDeletedSamples = yield db_1.default.sample.findMany({
        where: {
            OR: samplesGroups,
        },
    });
    const teams = yield db_1.default.team.findMany();
    const groupedByTeam = {};
    // If a team has no samples it wont show up in the groupedByTeam object
    // But we want it to show up as an empty array so we can show the team exists
    // So we get all teams and initialize their arrays
    for (const team of teams) {
        groupedByTeam[team.name] = [];
    }
    for (const sample of newestDeletedSamples) {
        groupedByTeam[sample.team_name].push(sample);
    }
    res.status(200).json(groupedByTeam);
});
exports.getDeletedSamples = getDeletedSamples;
const createSample = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const team = data.team_name;
    const teamExists = yield (0, db_1.doesTeamExist)(team);
    if (!teamExists)
        return res.status(404).json({ message: `Team "${team}" not found` });
    const sample = yield db_1.default.sample.create({
        data,
    });
    (0, email_1.sendEmailOnSampleCreate)(sample);
    res.status(201).json(sample);
});
exports.createSample = createSample;
const updateSample = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sample = yield db_1.default.sample.findUnique({
            where: {
                id,
            },
        });
        if (!sample)
            return res.status(404).json({ message: `Sample "${id}" not found` });
        const isDeleted = yield db_1.default.deleted.findFirst({
            where: {
                audit_id: sample.audit_id,
            },
        });
        if (isDeleted !== null)
            return res.status(404).json({ message: `Sample "${id}" not found` });
        const newSampleData = Object.assign(Object.assign({ expiration_date: sample.expiration_date, team_name: sample.team_name }, req.body), { data: Object.assign(Object.assign({}, sample.data), req.body.data), audit_id: sample.audit_id, date_created: sample.date_created });
        const newSample = yield db_1.default.sample.create({
            data: newSampleData,
        });
        res.status(200).json(newSample);
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    }
});
exports.updateSample = updateSample;
const deleteSample = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const sample = yield db_1.default.sample.findUnique({
        where: {
            id,
        },
    });
    if (!sample)
        return res.status(404).json({ message: `Sample "${id}" not found` });
    const isDeleted = yield db_1.default.deleted.findFirst({
        where: {
            audit_id: sample.audit_id,
        },
    });
    if (isDeleted !== null)
        return res.status(404).json({ message: `Sample "${id}" not found` });
    yield db_1.default.deleted.create({
        data: {
            audit_id: sample.audit_id,
            team_name: sample.team_name,
        },
    });
    res.status(200).json(sample);
});
exports.deleteSample = deleteSample;
const deleteSamples = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ids } = req.body;
    if (!ids)
        return res.status(400).json({ message: 'No ids provided' });
    const samples = yield db_1.default.sample.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });
    if (samples.length === 0)
        return res.status(404).json({ message: 'No samples found' });
    yield db_1.default.deleted.createMany({
        data: samples.map((sample) => {
            return {
                audit_id: sample.audit_id,
                team_name: sample.team_name,
            };
        }),
    });
    res.status(200).json(samples);
});
exports.deleteSamples = deleteSamples;
