/**
 * base route /printers
 * - create
 * - delete
 * - get
 * - update
 */

import { RequestHandler } from 'express'
import prisma from '../db'

export const getPrinters: RequestHandler = async (req, res) => {
    const printers = await prisma.printer.findMany()

    res.status(200).json(printers)
}

export const getPrinter: RequestHandler = async (req, res) => {
    const { ip } = req.params

    const printer = await prisma.printer.findUnique({
        where: {
            ip,
        },
    })

    if (!printer)
        return res.status(404).json({ message: `Printer "${ip}" not found` })

    res.status(200).json(printer)
}

export const createPrinter: RequestHandler = async (req, res) => {
    const { ip, name, location } = req.body

    const printer = await prisma.printer.create({
        data: {
            ip,
            name,
            location,
        },
    })

    res.status(201).json(printer)
}

export const deletePrinter: RequestHandler = async (req, res) => {
    const { ip } = req.params

    const printer = await prisma.printer.delete({
        where: {
            ip,
        },
    })

    if (!printer)
        return res.status(404).json({ message: `Printer "${ip}" not found` })

    res.status(200).json(printer)
}

export const updatePrinter: RequestHandler = async (req, res) => {
    const { ip } = req.params
    const { ip: newIP, name, location } = req.body

    const printer = await prisma.printer.update({
        where: {
            ip,
        },
        data: {
            ip: newIP,
            name,
            location,
        },
    })

    res.status(200).json(printer)
}
