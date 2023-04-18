import { RequestHandler } from 'express'
import prisma, { getDeletedAuditIds, getNewestSamples } from '../db'

export const getAllSamples: RequestHandler = async (req, res) => {
    try {
        const samples = await prisma.sample.findMany()
        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: "Couldn't get all samples for an unknown reason",
        })
    }
}

export const getAllDeletedSamples: RequestHandler = async (req, res) => {
    try {
        const deletedAuditIds = await getDeletedAuditIds()
        const samples = await prisma.sample.findMany({
            where: {
                auditId: {
                    in: deletedAuditIds,
                },
            },
        })
        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: "Couldn't get all deleted samples for an unknown reason",
        })
    }
}

export const getAllNewestSamples: RequestHandler = async (req, res) => {
    try {
        const samples = await getNewestSamples()
        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: "Couldn't get all newest samples for an unknown reason",
        })
    }
}

export const getAllNewestNonDeletedSamples: RequestHandler = async (
    req,
    res
) => {
    try {
        const deletedAuditIds = await getDeletedAuditIds()
        const newestSamples = await getNewestSamples()
        const samples = newestSamples.filter(
            ({ auditId }) => !deletedAuditIds.includes(auditId)
        )
        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: "Couldn't get all newest non deleted samples for an unknown reason",
        })
    }
}

export const getAllNewestDeletedSamples: RequestHandler = async (req, res) => {
    try {
        const deletedAuditIds = await getDeletedAuditIds()
        const newestSamples = await getNewestSamples()
        const samples = newestSamples.filter(({ auditId }) =>
            deletedAuditIds.includes(auditId)
        )
        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: "Couldn't get all newest deleted samples for an unknown reason",
        })
    }
}

export const getSample: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
        const sample = await prisma.sample.findUnique({
            where: {
                id,
            },
        })

        if (!sample)
            return res
                .status(400)
                .send({ reason: `No sample exists with id '${id}'` })

        res.status(200).send(sample)
    } catch (error) {
        res.status(500).send({
            reason: `Couldn't get sample with id '${id}`,
        })
    }
}

export const getSampleAuditTrail: RequestHandler = async (req, res) => {
    const { id } = req.params

    try {
        const sample = await prisma.sample.findUnique({
            where: {
                id,
            },
            select: {
                auditId: true,
            },
        })

        if (!sample)
            return res
                .status(400)
                .send({ reason: `No sample exists with id '${id}'` })

        const auditId = sample.auditId

        const samples = await prisma.sample.findMany({
            where: {
                auditId,
            },
            orderBy: {
                auditNumber: 'desc',
            },
        })

        res.status(200).send(samples)
    } catch (error) {
        res.status(500).send({
            reason: `Couldn't get audit trail for sample with id '${id}`,
        })
    }
}
