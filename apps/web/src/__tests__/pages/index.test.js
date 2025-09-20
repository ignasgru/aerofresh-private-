import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Home from '../pages/index';
// Mock Next.js router
vi.mock('next/router', () => ({
    useRouter: () => ({
        push: vi.fn(),
        pathname: '/',
        query: {},
    }),
}));
// Mock fetch
global.fetch = vi.fn();
describe('Home Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });
    it('renders the main heading', () => {
        render(_jsx(Home, {}));
        expect(screen.getByText('Aircraft Information Platform')).toBeInTheDocument();
    });
    it('renders search input', () => {
        render(_jsx(Home, {}));
        const searchInput = screen.getByPlaceholderText(/enter tail number/i);
        expect(searchInput).toBeInTheDocument();
    });
    it('handles search input changes', () => {
        render(_jsx(Home, {}));
        const searchInput = screen.getByPlaceholderText(/enter tail number/i);
        fireEvent.change(searchInput, { target: { value: 'N123AB' } });
        expect(searchInput).toHaveValue('N123AB');
    });
    it('performs search when button is clicked', async () => {
        const mockResults = [
            { tail: 'N123AB', make: 'Cessna', model: '172', year: 2020 },
        ];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: mockResults }),
        });
        render(_jsx(Home, {}));
        const searchInput = screen.getByPlaceholderText(/enter tail number/i);
        const searchButton = screen.getByRole('button', { name: /search/i });
        fireEvent.change(searchInput, { target: { value: 'N123AB' } });
        fireEvent.click(searchButton);
        await waitFor(() => {
            expect(global.fetch).toHaveBeenCalledWith('/api/search?q=N123AB');
        });
    });
    it('shows loading state during search', async () => {
        global.fetch.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({
            ok: true,
            json: async () => ({ results: [] }),
        }), 100)));
        render(_jsx(Home, {}));
        const searchInput = screen.getByPlaceholderText(/enter tail number/i);
        const searchButton = screen.getByRole('button', { name: /search/i });
        fireEvent.change(searchInput, { target: { value: 'N123AB' } });
        fireEvent.click(searchButton);
        expect(screen.getByText(/searching/i)).toBeInTheDocument();
    });
    it('displays search results', async () => {
        const mockResults = [
            { tail: 'N123AB', make: 'Cessna', model: '172', year: 2020 },
            { tail: 'N456CD', make: 'Piper', model: 'Cherokee', year: 2019 },
        ];
        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({ results: mockResults }),
        });
        render(_jsx(Home, {}));
        const searchInput = screen.getByPlaceholderText(/enter tail number/i);
        const searchButton = screen.getByRole('button', { name: /search/i });
        fireEvent.change(searchInput, { target: { value: 'test' } });
        fireEvent.click(searchButton);
        await waitFor(() => {
            expect(screen.getByText('N123AB')).toBeInTheDocument();
            expect(screen.getByText('N456CD')).toBeInTheDocument();
        });
    });
    it('renders feature cards', () => {
        render(_jsx(Home, {}));
        expect(screen.getByText('Safety Records')).toBeInTheDocument();
        expect(screen.getByText('Live Tracking')).toBeInTheDocument();
        expect(screen.getByText('Ownership History')).toBeInTheDocument();
    });
});
