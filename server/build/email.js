"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmailOnSampleCreate = void 0;
const nodemailer = __importStar(require("nodemailer"));
const schedule = __importStar(require("node-schedule"));
function subtractDays(date, days) {
    return new Date(date.getTime() - days * 24 * 60 * 60 * 1000);
}
const sendEmailOnSampleCreate = (sample) => __awaiter(void 0, void 0, void 0, function* () {
    let emailTarget = process.env.DEFAULT_EMAIL_TARGET;
    if (sample.data && sample.data.hasOwnProperty('isid')) {
        emailTarget = `${sample.data['isid']}@merck.com`;
    }
    const expirationDate = sample.expiration_date;
    const now = new Date(Date.now());
    const daysUntilExpiration = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    const dateSevenDaysOut = subtractDays(expirationDate, 7);
    const dateThreeDaysOut = subtractDays(expirationDate, 3);
    const dateOneDayOut = subtractDays(expirationDate, 1);
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    if (!emailUser || !emailPassword) {
        console.error('Email user or password not set');
        return;
    }
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: emailUser,
            pass: emailPassword,
        },
    });
    const getMailInfo = (days) => ({
        from: emailUser,
        to: emailTarget,
        subject: `Sample expires ${`${days === 0 ? 'today' : `in ${days} days`}`}`,
        // text: `Sample ${sample.name} expires in ${days} days`,
        html: `
            <h1 style="font-family:verdana; color: red; text-align: center;">REMINDER: You have a sample that expires ${`${days === 0 ? 'today' : `in ${days} days`}`}</h1>
            <p>Sample:
                <ul>
                    <li>ID: ${sample.id}</li>  
                    <li>Audit ID: ${sample.audit_id}</li>
                    <li>Expires: ${sample.expiration_date}</li>
                    <li>Data: ${JSON.stringify(sample.data, null, 2)}</li>
                </ul>
            </p>
        `,
    });
    if (daysUntilExpiration <= 7) {
        // await transport.sendMail(getMailInfo(1))
        // send the email in one day
        schedule.scheduleJob(dateOneDayOut, () => __awaiter(void 0, void 0, void 0, function* () {
            yield transport.sendMail(getMailInfo(1));
        }));
        schedule.scheduleJob(expirationDate, () => __awaiter(void 0, void 0, void 0, function* () {
            yield transport.sendMail(getMailInfo(0));
        }));
        return;
    }
    schedule.scheduleJob(dateSevenDaysOut, () => __awaiter(void 0, void 0, void 0, function* () {
        yield transport.sendMail(getMailInfo(7));
    }));
    schedule.scheduleJob(dateThreeDaysOut, () => __awaiter(void 0, void 0, void 0, function* () {
        yield transport.sendMail(getMailInfo(3));
    }));
    schedule.scheduleJob(dateOneDayOut, () => __awaiter(void 0, void 0, void 0, function* () {
        yield transport.sendMail(getMailInfo(1));
    }));
    schedule.scheduleJob(expirationDate, () => __awaiter(void 0, void 0, void 0, function* () {
        yield transport.sendMail(getMailInfo(0));
    }));
});
exports.sendEmailOnSampleCreate = sendEmailOnSampleCreate;
