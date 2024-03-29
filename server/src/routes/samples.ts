import express from "express";
import { 
    createSample, 
    deleteSample, 
    getSamples,
    getDeletedSamples,
    updateSample,
    getAuditTrail,
    deleteSamples,
    getTotalSampleCount,
    getSampleCountByMonth
} from "../controllers/samples";

/**
 * * Base route: /:team/samples
 */
const router = express.Router({
    mergeParams: true
});

// routes for home page stats
router.get('/sample_count', getTotalSampleCount)
router.get('/sample_count_month', getSampleCountByMonth)

router.get("/", getSamples);
router.post("/", createSample);

router.patch("/:id", updateSample)
router.delete("/:id", deleteSample);
router.delete("/", deleteSamples);

// Dillema: Should id be the sample id or the audit id?
// For now it will be sample id.
router.get("/:id/audit", getAuditTrail);

// Clashes with the getSample route
// router.get('/deleted', getDeletedSamples);



export default router;