import { Router } from 'express'
import {
    getAllDeletedSamples,
    getAllNewestNonDeletedSamples,
    getAllNewestSamples,
    getAllSamples,
    getSample,
    getSampleAuditTrail,
} from '../controllers/samples'

const router = Router()
router.get('/', getAllNewestNonDeletedSamples)
router.get('/all', getAllSamples)
router.get('/deleted', getAllDeletedSamples)
router.get('/newest', getAllNewestSamples)

const sample = Router({ mergeParams: true })
sample.get('/', getSample)
sample.get('/audit', getSampleAuditTrail)

router.use('/:id', sample)

export default router
