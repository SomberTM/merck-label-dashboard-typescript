import { RequestHandler } from 'express'
import prisma from '../db'
import { TeamField } from '@prisma/client'

// TODO:
// - Possibly add a route that returns all fields grouped by team.

export const getAllTeamsFields: RequestHandler = async (req, res) => {
    try {
        const fields = await prisma.teamField.findMany()

        const teams = await prisma.team.findMany()

        const fieldsGroupedByTeam: Record<string, TeamField[]> = {}

        for (const team of teams) {
            fieldsGroupedByTeam[team.name] = fields.filter(
                (field) => field.team_name === team.name
            )
        }

        res.status(200).json(fieldsGroupedByTeam)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * Given a team name (through the route params), returns (responds with) all the fields that are in use by that team.
 * @param req
 * @param res
 * @returns
 */
export const getTeamsFields: RequestHandler = async (req, res) => {
    try {
        const { team: teamName } = req.params

        const team = await prisma.team.findUnique({
            where: {
                name: teamName,
            },
        })

        if (!team)
            return res
                .status(404)
                .json({ message: `No team with name "${teamName}" was found` })

        const fields = await prisma.teamField.findMany({
            where: {
                team_name: teamName,
            },
        })

        res.status(200).json(fields)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

/**
 * Gets a specific field from a specific team.
 * @param req
 * @param res
 * @returns
 */
export const getTeamsField: RequestHandler = async (req, res) => {
    try {
        const { team, id } = req.params

        const field = await prisma.teamField.findUnique({
            where: {
                id: parseInt(id),
            },
        })

        if (!field)
            return res.status(404).json({
                message: `No field with id "${id}" was found on team "${team}"`,
            })

        res.status(200).json(field)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

export const createTeamsField: RequestHandler = async (req, res) => {
    try {
        const { team_name, name, display_name } = req.body

        const field = await prisma.teamField.create({
            data: {
                name,
                display_name,
                team_name,
            },
        })

        res.status(201).json(field)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

export const deleteTeamsField: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params

        const deletedField = await prisma.teamField.delete({
            where: {
                id: parseInt(id),
            },
        })

        res.status(200).json(deletedField)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}

export const updateTeamsField: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params
        const { name, display_name } = req.body

        const updatedField = await prisma.teamField.update({
            where: {
                id: parseInt(id),
            },
            data: {
                name,
                display_name,
            },
        })

        res.status(200).json(updatedField)
    } catch (error: any) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
}
