import { PrismaClient, Sample } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient()

export const doesTeamExist = async (team: string) => {
    const teamInDB = await prisma.team.findUnique({
        where: {
            name: team,
        },
    })

    if (!teamInDB) return false

    return true
}

export const getDeletedAuditIds = async (
    teamId?: string
): Promise<string[]> => {
    try {
        const auditIds = await prisma.deletedSample.findMany({
            where: {
                teamId,
            },
            select: {
                sampleAuditId: true,
            },
        })
        return auditIds.map(({ sampleAuditId }) => sampleAuditId)
    } catch (error) {
        return []
    }
}

export const getUniqueAuditIds = async (teamId?: string): Promise<string[]> => {
    try {
        const distinctIds = await prisma.sample.findMany({
            distinct: ['auditId'],
            select: {
                auditId: true,
            },
        })
        return distinctIds.map(({ auditId }) => auditId)
    } catch (error) {
        return []
    }
}

export const getNewestSampleIds = async (
    teamId?: string
): Promise<string[]> => {
    try {
        const maxIds = await prisma.sample.groupBy({
            by: ['auditId'],
            _max: {
                auditNumber: true,
            },
        })
        const sampleIds = await prisma.sample.findMany({
            where: {
                teamId,
                AND: maxIds.map(({ auditId, _max: { auditNumber } }) => ({
                    auditId,
                    auditNumber: auditNumber!,
                })),
            },
            select: {
                id: true,
            },
        })
        return sampleIds.map(({ id }) => id)
    } catch (error) {
        return []
    }
}

export const getNewestSamples = async (teamId?: string): Promise<Sample[]> => {
    try {
        const maxIds = await prisma.sample.groupBy({
            by: ['auditId'],
            _max: {
                auditNumber: true,
            },
        })
        return await prisma.sample.findMany({
            where: {
                teamId,
                AND: maxIds.map(({ auditId, _max: { auditNumber } }) => ({
                    auditId,
                    auditNumber: auditNumber!,
                })),
            },
        })
    } catch (error) {
        return []
    }
}

export default prisma
