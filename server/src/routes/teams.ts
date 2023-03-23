import express from "express";
import { 
    createTeam, 
    deleteTeam, 
    getTeams, 
    updateTeam 
} from "../controllers/teams";

const router = express.Router({
    mergeParams: true
});

router.get('/', getTeams);

router.post('/', createTeam);

router.patch('/:name', updateTeam);

router.delete('/:name', deleteTeam);

export default router;