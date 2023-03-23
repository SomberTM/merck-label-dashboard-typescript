import { RequestHandler } from 'express'
import prisma from '../db'

export const getTeams: RequestHandler = async (req, res) => {
    try {
        const teams = await prisma.team.findMany()

        res.status(200).json(teams)
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

export const createTeam: RequestHandler = async (req, res) => {
    try {
        const { name } = req.body

        const team = await prisma.team.create({
            data: {
                name,
            },
        })

        res.status(200).json(team)
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

export const deleteTeam: RequestHandler = async (req, res) => {
    try {
        const { name } = req.params
        try {
            const team = await prisma.team.delete({
                where: {
                    name,
                },
            })

            if (!team)
                return res
                    .status(404)
                    .json({ message: `No team with name "${name}" was found` })

            res.status(200).json(team)
        } catch (err: any) {
            console.error(err)
            res.status(500).json({ message: err.message })
        }
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}

export const updateTeam: RequestHandler = async (req, res) => {
    try {
        const { name } = req.params
        const { name: newName } = req.body

        const team = await prisma.team.update({
            where: {
                name,
            },
            data: {
                name: newName,
            },
        })

        if (!team)
            return res
                .status(404)
                .json({ message: `No team with name "${name}" was found` })

        res.status(200).json(updateTeam)
    } catch (err: any) {
        console.error(err)
        res.status(500).json({ message: err.message })
    }
}
