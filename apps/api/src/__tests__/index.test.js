import { describe, it, expect, beforeEach, vi } from 'vitest';
// Mock Prisma
const mockPrisma = {
    aircraft: {
        findUnique: vi.fn(),
        findMany: vi.fn(),
    },
    accident: {
        count: vi.fn(),
        findMany: vi.fn(),
    },
    aircraftOwner: {
        count: vi.fn(),
        findMany: vi.fn(),
    },
    adDirective: {
        findMany: vi.fn(),
    },
    eventLive: {
        findFirst: vi.fn(),
    },
    weatherMetar: {
        findFirst: vi.fn(),
    },
};
vi.mock('@aerofresh/db/client', () => ({
    default: mockPrisma,
}));
describe('API Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    describe('Health Check', () => {
        it('should return health status', async () => {
            const request = new Request('http://localhost/api/health');
            const response = await fetch(request);
            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.ok).toBe(true);
            expect(data.ts).toBeTypeOf('number');
        });
    });
    describe('Aircraft Summary', () => {
        it('should return aircraft summary', async () => {
            const mockAircraft = {
                tail: 'N123AB',
                make: 'Cessna',
                model: '172',
            };
            mockPrisma.aircraft.findUnique.mockResolvedValue(mockAircraft);
            mockPrisma.accident.count.mockResolvedValue(2);
            mockPrisma.aircraftOwner.count.mockResolvedValue(3);
            const request = new Request('http://localhost/api/aircraft/N123AB/summary', {
                headers: {
                    'x-api-key': 'demo-api-key',
                },
            });
            const response = await fetch(request);
            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.tail).toBe('N123AB');
            expect(data.summary.ntsbAccidents).toBe(2);
            expect(data.summary.owners).toBe(3);
        });
        it('should return 404 for non-existent aircraft', async () => {
            mockPrisma.aircraft.findUnique.mockResolvedValue(null);
            const request = new Request('http://localhost/api/aircraft/INVALID/summary', {
                headers: {
                    'x-api-key': 'demo-api-key',
                },
            });
            const response = await fetch(request);
            expect(response.status).toBe(404);
        });
        it('should return 401 without API key', async () => {
            const request = new Request('http://localhost/api/aircraft/N123AB/summary');
            const response = await fetch(request);
            expect(response.status).toBe(401);
        });
    });
    describe('Search', () => {
        it('should return search results', async () => {
            const mockResults = [
                { tail: 'N123AB', make: 'Cessna', model: '172', year: 2020 },
                { tail: 'N456CD', make: 'Piper', model: 'Cherokee', year: 2019 },
            ];
            mockPrisma.aircraft.findMany.mockResolvedValue(mockResults);
            const request = new Request('http://localhost/api/search?make=Cessna', {
                headers: {
                    'x-api-key': 'demo-api-key',
                },
            });
            const response = await fetch(request);
            const data = await response.json();
            expect(response.status).toBe(200);
            expect(data.results).toHaveLength(2);
            expect(data.results[0].make).toBe('Cessna');
        });
    });
});
