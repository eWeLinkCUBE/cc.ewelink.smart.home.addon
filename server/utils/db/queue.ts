import logger from "../../log";

interface Job {
    key?: string;
    running: boolean;
    func: () => Promise<any>;
    resolve: any;
    reject: any;
}

class Queue {
    #jobs: Job[];
    readonly concurrent: number;

    constructor(concurrent = 1) {
        this.#jobs = [];
        this.concurrent = concurrent;
    }

    public async execute<T>(func: () => Promise<T>, key?: string): Promise<T> {
        return new Promise((resolve, reject) => {
            const job: Job = {
                key,
                func,
                running: false,
                resolve,
                reject,
            };
            // logger.info(`${job.key} queue info =========== pushed job is ${JSON.stringify(job)}`);
            this.#jobs.push(job);
            this.#executeLast();
        });
    }

    async #executeLast() {
        const job = this.#getLast();
        // logger.info(`queue info =========== execute last job as ${JSON.stringify(job)}`);

        if (!job) {
            // logger.info(`queue info =========== get next job as null`);
            return;
        }
        job.running = true;

        try {
            // logger.info(`${job.key} queue info =========== begin to write=====================`);
            const result = await job.func();
            // logger.info(`${job.key} queue info =========== execute job success and result is ${result}`);
            this.#jobs.splice(0, this.#jobs.indexOf(job) + 1);
            job.resolve(result);
            this.#executeLast();
        } catch (error) {
            logger.info(`${job.key} queue info =========== execute job failed and error is ${error}`);
            this.#jobs.splice(0, this.#jobs.indexOf(job) + 1);
            job.reject(error);
            this.#executeLast();
        }
    }




    #getLast(): Job | null {
        if (this.#jobs.filter((j) => j.running).length > (this.concurrent - 1)) {
            // logger.info(`queue info =========== excess concurrent time`);
            return null;
        }

        for (let i = this.#jobs.length; i >= 0; i--) {
            const job = this.#jobs[i - 1];
            if (!job) {
                // logger.info(`queue info =========== get Last for id ${i} can't get job`);
                return null
            }

            if (!job.running && (!job.key || !this.#jobs.find((j) => j.key === job.key && j.running))) {
                // logger.info(`queue info =========== getting for job id ${i}`)
                return job;
            }
        }

        return null;
    }

    clear(): void {
        this.#jobs = [];
    }

    count(): number {
        return this.#jobs.length;
    }
}

export default Queue;
