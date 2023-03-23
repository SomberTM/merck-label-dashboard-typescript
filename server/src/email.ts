import * as nodemailer from 'nodemailer'
import * as schedule from 'node-schedule'
import { Sample } from '@prisma/client'

function subtractDays(date: Date, days: number) {
    return new Date(date.getTime() - days * 24 * 60 * 60 * 1000)
}

export const sendEmailOnSampleCreate = async (sample: Sample) => {
    let emailTarget = process.env.DEFAULT_EMAIL_TARGET
    if (sample.data && sample.data.hasOwnProperty('isid')) {
        emailTarget = `${sample.data['isid']}@merck.com`
    }

    const expirationDate = sample.expiration_date
    const now = new Date(Date.now())

    const daysUntilExpiration = Math.floor(
        (expirationDate.getTime() - now.getTime()) / (1000 * 3600 * 24)
    )

    const dateSevenDaysOut = subtractDays(expirationDate, 7)
    const dateThreeDaysOut = subtractDays(expirationDate, 3)
    const dateOneDayOut = subtractDays(expirationDate, 1)

    const emailUser = process.env.EMAIL_USER
    const emailPassword = process.env.EMAIL_PASSWORD

    if (!emailUser || !emailPassword) {
        console.error('Email user or password not set')
        return
    }

    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword,
        },
    })

    const getMailInfo = (days: number) => ({
        from: emailUser,
        to: emailTarget,
        subject: `Sample expires ${`${
            days === 0 ? 'today' : `in ${days} days`
        }`}`,
        // text: `Sample ${sample.name} expires in ${days} days`,
        html: `
            <h1 style="font-family:verdana; color: red; text-align: center;">REMINDER: You have a sample that expires ${`${
                days === 0 ? 'today' : `in ${days} days`
            }`}</h1>
            <p>Sample:
                <ul>
                    <li>ID: ${sample.id}</li>  
                    <li>Audit ID: ${sample.audit_id}</li>
                    <li>Expires: ${sample.expiration_date}</li>
                    <li>Data: ${JSON.stringify(sample.data, null, 2)}</li>
                </ul>
            </p>
        `,
    })

    if (daysUntilExpiration <= 7) {
        // await transport.sendMail(getMailInfo(1))
        // send the email in one day
        schedule.scheduleJob(dateOneDayOut, async () => {
            await transport.sendMail(getMailInfo(1))
        })
        schedule.scheduleJob(expirationDate, async () => {
            await transport.sendMail(getMailInfo(0))
        })
        return
    }

    schedule.scheduleJob(dateSevenDaysOut, async () => {
        await transport.sendMail(getMailInfo(7))
    })

    schedule.scheduleJob(dateThreeDaysOut, async () => {
        await transport.sendMail(getMailInfo(3))
    })

    schedule.scheduleJob(dateOneDayOut, async () => {
        await transport.sendMail(getMailInfo(1))
    })

    schedule.scheduleJob(expirationDate, async () => {
        await transport.sendMail(getMailInfo(0))
    })
}
