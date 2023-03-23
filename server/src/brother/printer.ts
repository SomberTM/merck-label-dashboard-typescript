import IPP from 'ipp'

// @ts-ignore
IPP.parse.handleUnknownTag = function (tag, name, length, read) {
    return length ? read(length) : undefined
}

export class BrotherQLPrinter extends IPP.Printer {
    async executeAsync(
        operation: IPP.PrinterOpertaion,
        request: IPP.FullRequest
    ): Promise<IPP.FullResponse | undefined> {
        return new Promise((resolve, reject) => {
            const rejectAutomatically = setTimeout(() => {
                resolve(undefined)
            }, 5000)
            this.execute(operation, request, (err, res) => {
                if (err) {
                    reject(err)
                } else {
                    clearTimeout(rejectAutomatically)
                    resolve(res)
                }
            })
        })
    }

    async getAttributes(): Promise<IPP.GetPrinterAttributesResponse> {
        return <IPP.GetPrinterAttributesResponse>await this.executeAsync(
            'Get-Printer-Attributes',
            {
                'operation-attributes-tag': {
                    'attributes-charset': 'utf-8',
                    'requesting-user-name': 'class',
                },
            }
        )
    }

    async print(data: Buffer): Promise<boolean> {
        const job = <IPP.PrintJobResponse>await this.executeAsync('Print-Job', {
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
        })

        const id = job['job-attributes-tag']['job-id']

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

        return true
    }

    async getJob(jobId: number) {
        return <IPP.GetJobAttributesResponse>await this.executeAsync(
            'Get-Job-Attributes',
            {
                'operation-attributes-tag': {
                    'requesting-user-name': 'class',
                    'job-id': jobId,
                },
            }
        )
    }

    async getJobs(): Promise<IPP.GetJobsResponse> {
        return <IPP.GetJobsResponse>await this.executeAsync('Get-Jobs', {
            'operation-attributes-tag': {
                'requesting-user-name': 'class',
            },
        })
    }

    async cancelAllJobs(): Promise<IPP.FullResponse | null> {
        const jobs = await this.getJobs()
        var response: IPP.FullResponse | undefined = undefined

        if (jobs['job-attributes-tag']) {
            if (Array.isArray(jobs['job-attributes-tag'])) {
                for (const job of jobs['job-attributes-tag']) {
                    response = await this.executeAsync('Cancel-Job', {
                        'operation-attributes-tag': {
                            'requesting-user-name': 'class',
                            // @ts-ignore
                            'job-id': job['job-id'],
                        },
                    })
                }
            } else {
                response = await this.executeAsync('Cancel-Job', {
                    'operation-attributes-tag': {
                        'requesting-user-name': 'class',
                        // @ts-ignore
                        'job-id': jobs['job-attributes-tag']['job-id'],
                    },
                })
            }
        }

        return response!
    }
}
