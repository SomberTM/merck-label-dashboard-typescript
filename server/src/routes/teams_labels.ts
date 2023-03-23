// Teams can have multiple labels at different sizes
// Current idea is that only one label per size can be active at a time

import express from 'express'
import {
    createLabel,
    getAllLabels,
    generateLabelImage,
    printLabels,
    getLabel,
    deleteLabel,
    updateLabel,
} from '../controllers/teams_labels'

const router = express.Router({
    mergeParams: true,
})

router.get('/', getAllLabels)

router.post('/generate', generateLabelImage)

router.post('/print', printLabels)

router.post('/', createLabel)

router.get('/:id', getLabel)
router.patch('/:id', updateLabel)
router.delete('/:id', deleteLabel)

export default router
