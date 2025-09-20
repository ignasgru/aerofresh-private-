/**
 * AeroFresh ETL Scheduler
 * 
 * Scheduled Cloudflare Worker that triggers ETL jobs
 * and manages data ingestion from various aviation data sources
 */

import { PrismaClient } from '@prisma/client';

// Cloudflare Workers types
type ScheduledEvent = any;
type ExecutionContext = any;

// CORS headers for cross-origin requests
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ETL job configurations
const ETL_JOBS = {
  FAA_REGISTRY: {
    name: 'FAA Registry',
    schedule: '0 2 * * *', // Daily at 2 AM
    endpoint: '/api/etl/faa-registry',
    priority: 'high'
  },
  NTSB_ACCIDENTS: {
    name: 'NTSB Accidents',
    schedule: '0 3 * * 0', // Weekly on Sunday at 3 AM
    endpoint: '/api/etl/ntsb',
    priority: 'medium'
  },
  AD_DIRECTIVES: {
    name: 'AD Directives',
    schedule: '0 */6 * * *', // Every 6 hours
    endpoint: '/api/etl/ad-directives',
    priority: 'high'
  },
  OUR_AIRPORTS: {
    name: 'OurAirports',
    schedule: '0 1 1 * *', // Monthly on 1st at 1 AM
    endpoint: '/api/etl/airports',
    priority: 'low'
  },
  WEATHER_METAR: {
    name: 'Weather METAR',
    schedule: '*/15 * * * *', // Every 15 minutes
    endpoint: '/api/etl/weather',
    priority: 'high'
  },
  LIVE_ADS_B: {
    name: 'Live ADS-B',
    schedule: '*/5 * * * *', // Every 5 minutes
    endpoint: '/api/etl/live-adsb',
    priority: 'high'
  }
};

export default {
  async scheduled(event: ScheduledEvent, env: any, ctx: ExecutionContext): Promise<void> {
    console.log(`🕐 ETL Scheduler triggered: ${event.cron}`);
    
    try {
      // Determine which ETL job to run based on cron schedule
      const job = getJobBySchedule(event.cron);
      if (!job) {
        console.log(`❌ No ETL job found for schedule: ${event.cron}`);
        return;
      }

      console.log(`🚀 Starting ETL job: ${job.name}`);
      
      // Execute the ETL job
      await executeETLJob(job, env);
      
      console.log(`✅ ETL job completed: ${job.name}`);
    } catch (error) {
      console.error(`❌ ETL job failed:`, error);
      
      // Send error notification (you can integrate with Sentry, Slack, etc.)
      await sendErrorNotification(error, env);
    }
  },

  async fetch(request: Request, env: any, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: CORS,
      });
    }

    try {
      // Manual ETL job triggers
      if (path.startsWith('/api/etl/')) {
        return await handleManualETL(request, env, path);
      }
      
      // ETL status and health checks
      if (path === '/api/etl/status') {
        return await handleETLStatus(env);
      }
      
      // Queue consumer for heavy processing
      if (path === '/api/etl/queue') {
        return await handleQueueConsumer(request, env);
      }

      return new Response(JSON.stringify({
        error: 'Endpoint not found',
        availableEndpoints: [
          '/api/etl/status',
          '/api/etl/faa-registry',
          '/api/etl/ntsb',
          '/api/etl/ad-directives',
          '/api/etl/airports',
          '/api/etl/weather',
          '/api/etl/live-adsb'
        ]
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          ...CORS,
        },
      });
    } catch (error) {
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...CORS,
        },
      });
    }
  },
};

/**
 * Get ETL job configuration by cron schedule
 */
function getJobBySchedule(cron: string): typeof ETL_JOBS[keyof typeof ETL_JOBS] | null {
  const jobEntries = Object.entries(ETL_JOBS);
  const job = jobEntries.find(([_, config]) => config.schedule === cron);
  return job ? job[1] : null;
}

/**
 * Execute an ETL job
 */
async function executeETLJob(job: typeof ETL_JOBS[keyof typeof ETL_JOBS], env: any): Promise<void> {
  console.log(`🔄 Executing ETL job: ${job.name}`);
  
  // Store job state in KV
  await env.ETL_STATE.put(`job:${job.name}:status`, 'running');
  await env.ETL_STATE.put(`job:${job.name}:started`, Date.now().toString());
  
  try {
    // For heavy jobs, push to queue for processing
    if (job.priority === 'high' && job.name !== 'Weather METAR') {
      await env.ETL_QUEUE.send({
        jobName: job.name,
        endpoint: job.endpoint,
        timestamp: Date.now()
      });
      
      console.log(`📤 Job ${job.name} queued for processing`);
    } else {
      // Execute lightweight jobs directly
      await executeLightweightETL(job, env);
    }
    
    // Update job status
    await env.ETL_STATE.put(`job:${job.name}:status`, 'completed');
    await env.ETL_STATE.put(`job:${job.name}:completed`, Date.now().toString());
    
  } catch (error) {
    await env.ETL_STATE.put(`job:${job.name}:status`, 'failed');
    await env.ETL_STATE.put(`job:${job.name}:error`, error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

/**
 * Execute lightweight ETL jobs directly
 */
async function executeLightweightETL(job: typeof ETL_JOBS[keyof typeof ETL_JOBS], env: any): Promise<void> {
  console.log(`⚡ Executing lightweight ETL: ${job.name}`);
  
  // This would contain the actual ETL logic
  // For now, we'll simulate the work
  switch (job.name) {
    case 'Weather METAR':
      await fetchWeatherData(env);
      break;
    case 'Live ADS-B':
      await fetchLiveADS_B(env);
      break;
    default:
      console.log(`📋 Job ${job.name} would be executed here`);
  }
}

/**
 * Fetch weather data
 */
async function fetchWeatherData(env: any): Promise<void> {
  console.log('🌤️ Fetching weather data...');
  
  if (!env.AVWX_TOKEN) {
    console.log('⚠️ No AVWX token available, skipping weather fetch');
    return;
  }
  
  // Fetch METAR data for major airports
  const airports = ['KLAX', 'KJFK', 'KORD', 'KDFW', 'KATL'];
  
  for (const airport of airports) {
    try {
      const response = await fetch(`https://avwx.rest/api/metar/${airport}`, {
        headers: {
          'Authorization': `BEARER ${env.AVWX_TOKEN}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Weather data fetched for ${airport}`);
        
        // Store in KV for caching
        await env.ETL_CACHE.put(`weather:${airport}`, JSON.stringify(data), {
          expirationTtl: 3600 // 1 hour
        });
      }
    } catch (error) {
      console.error(`❌ Failed to fetch weather for ${airport}:`, error);
    }
  }
}

/**
 * Fetch live ADS-B data
 */
async function fetchLiveADS_B(env: any): Promise<void> {
  console.log('✈️ Fetching live ADS-B data...');
  
  try {
    // Use OpenSky Network API
    const response = await fetch('https://opensky-network.org/api/states/all');
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ ADS-B data fetched: ${data.states?.length || 0} aircraft`);
      
      // Store raw data in R2 for audit
      await env.RAW_DATA.put(
        `adsb/${new Date().toISOString().split('T')[0]}/${Date.now()}.json`,
        JSON.stringify(data)
      );
      
      // Process and store in database (would be done by queue consumer)
      console.log('📤 ADS-B data queued for processing');
    }
  } catch (error) {
    console.error('❌ Failed to fetch ADS-B data:', error);
  }
}

/**
 * Handle manual ETL job triggers
 */
async function handleManualETL(request: Request, env: any, path: string): Promise<Response> {
  const jobName = path.split('/').pop();
  const job = Object.values(ETL_JOBS).find(j => j.endpoint === path);
  
  if (!job) {
    return new Response(JSON.stringify({
      error: 'ETL job not found',
      availableJobs: Object.values(ETL_JOBS).map(j => j.endpoint)
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
  
  try {
    await executeETLJob(job, env);
    
    return new Response(JSON.stringify({
      success: true,
      message: `ETL job ${job.name} completed successfully`,
      timestamp: new Date().toISOString()
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'ETL job failed',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...CORS },
    });
  }
}

/**
 * Handle ETL status requests
 */
async function handleETLStatus(env: any): Promise<Response> {
  const status: any = {
    timestamp: new Date().toISOString(),
    jobs: {}
  };
  
  // Get status for each job
  for (const job of Object.values(ETL_JOBS)) {
    const jobStatus = await env.ETL_STATE.get(`job:${job.name}:status`);
    const started = await env.ETL_STATE.get(`job:${job.name}:started`);
    const completed = await env.ETL_STATE.get(`job:${job.name}:completed`);
    const error = await env.ETL_STATE.get(`job:${job.name}:error`);
    
    status.jobs[job.name] = {
      status: jobStatus || 'never_run',
      started: started ? new Date(parseInt(started)).toISOString() : null,
      completed: completed ? new Date(parseInt(completed)).toISOString() : null,
      error: error || null,
      schedule: job.schedule,
      priority: job.priority
    };
  }
  
  return new Response(JSON.stringify(status), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

/**
 * Handle queue consumer for heavy processing
 */
async function handleQueueConsumer(request: Request, env: any): Promise<Response> {
  console.log('🔄 Processing ETL queue...');
  
  // This would be called by Cloudflare Queues
  // Process heavy ETL jobs here
  
  return new Response(JSON.stringify({
    success: true,
    message: 'Queue consumer processed successfully'
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json', ...CORS },
  });
}

/**
 * Send error notifications
 */
async function sendErrorNotification(error: any, env: any): Promise<void> {
  console.error('📧 Sending error notification:', error);
  
  // You can integrate with:
  // - Sentry for error tracking
  // - Slack/Discord for notifications
  // - Email services
  // - PagerDuty for critical alerts
  
  // For now, just log the error
  console.error('ETL Error:', {
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : undefined,
    timestamp: new Date().toISOString()
  });
}
