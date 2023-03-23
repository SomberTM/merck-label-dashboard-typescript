import { PrismaClient } from '@prisma/client'
const prisma: PrismaClient = new PrismaClient();

export const doesTeamExist = async (team: string) => {
    const teamInDB = await prisma.team.findUnique({
        where: {
            name: team
        }
    });

    if (!teamInDB) return false;

    return true;
}

export default prisma;

