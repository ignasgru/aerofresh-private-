import { PrismaClient } from '@prisma/client';
// Create a singleton to avoid instantiating PrismaClient multiple times in development.
// For Cloudflare Workers, we need to handle the global differently
let prismaClient;
if (typeof global !== 'undefined' && global.prisma) {
    prismaClient = global.prisma;
}
else {
    prismaClient = new PrismaClient();
    if (typeof global !== 'undefined' && process.env.NODE_ENV !== 'production') {
        global.prisma = prismaClient;
    }
}
export default prismaClient;
