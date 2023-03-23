import { RequestHandler } from 'express'
import prisma from '../db'
import { Label } from '@prisma/client'
import { generateLabelImageWithLayoutAndSample } from '../brother/label_generation'
import { sendLabelsToPrinter } from '../brother/ipp_printing'

export const getAllLabels: RequestHandler = async (req, res) => {
    try {
        const { team, width, length } = req.query

        if (team && !(width || length)) {
            const labels = await prisma.label.findMany({
                where: {
                    team_name: team as string,
                },
            })
            return res.status(200).json(labels)
        }

        if (team && width && length) {
            const labels = await prisma.label.findMany({
                where: {
                    team_name: team as string,
                    width: Number(width),
                    length: Number(length),
                },
            })

            return res.status(200).json(labels)
        }

        const labels = await prisma.label.findMany()

        const teams = await prisma.team.findMany()

        const groupedByTeam: Record<string, Label[]> = {}

        for (const { name } of teams) {
            groupedByTeam[name] = labels.filter(
                (label) => label.team_name == name
            )
        }

        res.status(200).json(groupedByTeam)
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const getLabel: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params

        const label = await prisma.label.findUnique({
            where: {
                id: Number(id),
            },
        })

        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` })
        }

        res.status(200).json(label)
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const createLabel: RequestHandler = async (req, res) => {
    try {
        const { team_name, width, length, name, data } = req.body

        if (!team_name || !width || !length || !name) {
            return res.status(400).json({
                message:
                    'To create a new label layout, you must specify the team name, width, length, name, and data of the label',
            })
        }

        const label = await prisma.label.create({
            data: {
                team_name,
                name,
                width,
                length,
                data: data ?? {},
            },
        })

        res.status(201).json(label)
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const generateLabelImage: RequestHandler = async (req, res) => {
    try {
        var { sample_id, layout_id } = req.body

        const sample = await prisma.sample.findFirst({
            where: {
                id: sample_id,
            },
        })

        if (sample == null) {
            return res
                .status(404)
                .json({ message: `No sample found with id "${sample_id}"` })
        }

        const labelLayout = await prisma.label.findUnique({
            where: {
                id: layout_id,
            },
        })

        if (labelLayout == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${layout_id}"` })
        }

        try {
            const label = await generateLabelImageWithLayoutAndSample(
                labelLayout!,
                sample!
            )

            const base64 = (await label.toBuffer()).toString('base64')

            res.status(200).json(base64)
        } catch (e: any) {
            res.status(500).json({ message: e.message })
        }
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const printLabels: RequestHandler = async (req, res) => {
    try {
        const { images, printer } = req.body

        try {
            const success = await sendLabelsToPrinter(images, printer)
            res.status(200).json({ success })
        } catch (err: any) {
            res.status(500).json({ message: err.message })
        }
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const deleteLabel: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params

        const label = await prisma.label.delete({
            where: {
                id: Number(id),
            },
        })

        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` })
        }

        res.status(200).json(label)
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}

export const updateLabel: RequestHandler = async (req, res) => {
    try {
        const { id } = req.params
        const { team_name, width, length, name, data } = req.body

        const label = await prisma.label.update({
            where: {
                id: Number(id),
            },
            data: {
                team_name,
                name,
                width,
                length,
                data: data ?? {},
            },
        })

        if (label == null) {
            return res
                .status(404)
                .json({ message: `No label found with id "${id}"` })
        }

        res.status(200).json(label)
    } catch (e: any) {
        console.log(e)
        res.status(500).json({ message: e.message })
    }
}
