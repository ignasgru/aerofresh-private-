/**
 * PostgreSQL Client for Cloudflare Workers
 * 
 * This module provides a database client that works with Cloudflare Workers
 * using the Neon serverless driver for PostgreSQL connections.
 */

import { Client } from "@neondatabase/serverless";

export async function createClient(databaseUrl?: string) {
  if (!databaseUrl) {
    throw new Error("DATABASE_URL environment variable is required");
  }
  
  const client = new Client(databaseUrl);
  await client.connect();
  
  return client;
}

/**
 * Helper function to execute a query with error handling
 */
export async function executeQuery(client: Client, query: string, params: any[] = []) {
  try {
    const result = await client.query(query, params);
    return result;
  } catch (error) {
    console.error("Database query failed:", error);
    throw error;
  }
}

/**
 * Helper function to upsert data (insert or update)
 */
export async function upsertData(
  client: Client, 
  table: string, 
  data: Record<string, any>, 
  conflictColumns: string[]
) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`);
  
  const updateSet = columns
    .filter(col => !conflictColumns.includes(col))
    .map(col => `${col} = EXCLUDED.${col}`)
    .join(", ");
  
  const query = `
    INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${placeholders.join(", ")})
    ON CONFLICT (${conflictColumns.join(", ")})
    DO UPDATE SET ${updateSet}
    RETURNING *
  `;
  
  return executeQuery(client, query, values);
}
