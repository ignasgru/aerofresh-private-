/**
 * ETL Loader Worker
 * 
 * This worker runs on a cron schedule and enqueues ETL jobs to be processed
 * by the consumer worker. It's responsible for determining what data needs
 * to be synced and creating job messages.
 */

// Cloudflare Workers types
type Queue = any;
type ScheduledEvent = any;
type ExecutionContext = any;
type ExportedHandler<T = any> = any;

export interface Env {
  ETL_QUEUE: Queue;
}

type Job =
  | { kind: "FAA_REGISTRY"; since?: string }
  | { kind: "NTSB_SYNC"; since?: string }
  | { kind: "AD_SYNC"; since?: string }
  | { kind: "AIRPORTS_SYNC" }
  | { kind: "WEATHER_METAR" }
  | { kind: "LIVE_ADS_B" };

export default {
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log(`[ETL Loader] Triggered at ${new Date().toISOString()}`);
    
    // Define the jobs to be processed
    const jobs: Job[] = [
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
      } catch (error) {
        console.error(`[ETL Loader] Failed to enqueue job ${job.kind}:`, error);
      }
    }
    
    console.log(`[ETL Loader] Enqueued ${jobs.length} jobs successfully`);
  },
} satisfies ExportedHandler<Env>;
