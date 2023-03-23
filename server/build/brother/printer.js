"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BrotherQLPrinter = void 0;
const ipp_1 = __importDefault(require("ipp"));
// @ts-ignore
ipp_1.default.parse.handleUnknownTag = function (tag, name, length, read) {
    return length ? read(length) : undefined;
};
class BrotherQLPrinter extends ipp_1.default.Printer {
    executeAsync(operation, request) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                const rejectAutomatically = setTimeout(() => {
                    resolve(undefined);
                }, 5000);
                this.execute(operation, request, (err, res) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        clearTimeout(rejectAutomatically);
                        resolve(res);
                    }
                });
            });
        });
    }
    getAttributes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAsync('Get-Printer-Attributes', {
                'operation-attributes-tag': {
                    'attributes-charset': 'utf-8',
                    'requesting-user-name': 'class',
                },
            });
        });
    }
    print(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const job = yield this.executeAsync('Print-Job', {
                'operation-attributes-tag': {
                    'attributes-charset': 'utf-8',
                    'job-name': 'print-job',
                    'requesting-user-name': 'class',
                    'document-format': 'application/octet-stream',
                },
                'job-attributes-tag': {
                    'orientation-requested': 'landscape',
                },
                data: data,
            });
            const id = job['job-attributes-tag']['job-id'];
            // hacky way to figure out if a job is completed.
            // Not sure if I like this though, it's not very reliable and
            // can cause a lot of unnecessary requests to the printer, overwhelming it.
            // var completed: boolean = false;
            // await new Promise<void>((resolve) => {
            //     const interval = setInterval(async () => {
            //         if (!completed) {
            //             const status = await this.getJob(id);
            //             // @ts-ignore
            //             completed = status["job-attributes-tag"]["job-state"] == "completed";
            //         } else {
            //             clearInterval(interval);
            //             resolve();
            //         }
            //     }, 250);
            // })
            return true;
        });
    }
    getJob(jobId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAsync('Get-Job-Attributes', {
                'operation-attributes-tag': {
                    'requesting-user-name': 'class',
                    'job-id': jobId,
                },
            });
        });
    }
    getJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.executeAsync('Get-Jobs', {
                'operation-attributes-tag': {
                    'requesting-user-name': 'class',
                },
            });
        });
    }
    cancelAllJobs() {
        return __awaiter(this, void 0, void 0, function* () {
            const jobs = yield this.getJobs();
            var response = undefined;
            if (jobs['job-attributes-tag']) {
                if (Array.isArray(jobs['job-attributes-tag'])) {
                    for (const job of jobs['job-attributes-tag']) {
                        response = yield this.executeAsync('Cancel-Job', {
                            'operation-attributes-tag': {
                                'requesting-user-name': 'class',
                                // @ts-ignore
                                'job-id': job['job-id'],
                            },
                        });
                    }
                }
                else {
                    response = yield this.executeAsync('Cancel-Job', {
                        'operation-attributes-tag': {
                            'requesting-user-name': 'class',
                            // @ts-ignore
                            'job-id': jobs['job-attributes-tag']['job-id'],
                        },
                    });
                }
            }
            return response;
        });
    }
}
exports.BrotherQLPrinter = BrotherQLPrinter;
