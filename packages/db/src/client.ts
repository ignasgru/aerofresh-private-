import { PrismaClient } from '@prisma/client';

// Create a singleton to avoid instantiating PrismaClient multiple times in development.
// For Cloudflare Workers, we need to handle the global differently
let prismaClient: PrismaClient;

// Type-safe global access
declare global {
  var prisma: PrismaClient | undefined;
}

if (typeof global !== 'undefined' && (global as any).prisma) {
  prismaClient = (global as any).prisma;
} else {
  prismaClient = new PrismaClient();
  if (typeof global !== 'undefined' && process.env.NODE_ENV !== 'production') {
    (global as any).prisma = prismaClient;
  }
}

export default prismaClient;
