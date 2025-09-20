/**
 * ETL Loader Worker
 *
 * This worker runs on a cron schedule and enqueues ETL jobs to be processed
 * by the consumer worker. It's responsible for determining what data needs
 * to be synced and creating job messages.
 */
export default {
    async scheduled(_event, env, ctx) {
        console.log(`[ETL Loader] Triggered at ${new Date().toISOString()}`);
        // Define the jobs to be processed
        const jobs = [
            { kind: "FAA_REGISTRY" },
            { kind: "NTSB_SYNC" },
            { kind: "AD_SYNC" },
            { kind: "AIRPORTS_SYNC" },
            { kind: "WEATHER_METAR" },
            { kind: "LIVE_ADS_B" },
        ];
        // Enqueue each job
        for (const job of jobs) {
            try {
                await env.ETL_QUEUE.send(job);
                console.log(`[ETL Loader] Enqueued job: ${job.kind}`);
            }
            catch (error) {
                console.error(`[ETL Loader] Failed to enqueue job ${job.kind}:`, error);
            }
        }
        console.log(`[ETL Loader] Enqueued ${jobs.length} jobs successfully`);
    },
};
