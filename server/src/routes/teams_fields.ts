import express from "express";
import {
    createTeamsField,
    deleteTeamsField,
    getAllTeamsFields,
    getTeamsField,
    getTeamsFields, 
    updateTeamsField
} from "../controllers/teams_fields";

/**
 * * Base route: /fields
 */
const router = express.Router({
    mergeParams: true
});

router.get('/', getAllTeamsFields);
router.post('/', createTeamsField);

router.get('/:team', getTeamsFields);
router.get('/:team/:id', getTeamsField);

router.delete('/:id', deleteTeamsField);
router.patch('/:id', updateTeamsField);

export default router;