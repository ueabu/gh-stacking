/**
 * Tests for TeamsFetcher Component
 */
import TeamsFetcher from './TeamsFetcher';

// Mock axios
global.window = {
    axios: {
        get: jest.fn()
    }
};

describe('TeamsFetcher', () => {
    beforeEach(() => {
        // Clear all mocks before each test
        jest.clearAllMocks();
    });

    describe('Constructor', () => {
        it('should initialize with default options', () => {
            const fetcher = new TeamsFetcher({ autoFetch: false });

            expect(fetcher.apiUrl).toBe('/api/teams');
            expect(fetcher.teams).toEqual([]);
            expect(fetcher.loading).toBe(false);
            expect(fetcher.error).toBe(null);
        });

        it('should initialize with custom apiUrl', () => {
            const fetcher = new TeamsFetcher({
                apiUrl: '/custom/teams',
                autoFetch: false
            });

            expect(fetcher.apiUrl).toBe('/custom/teams');
        });

        it('should auto-fetch by default', async () => {
            window.axios.get.mockResolvedValue({
                data: {
                    success: true,
                    data: [{ id: 1, name: 'Team A' }]
                }
            });

            const fetcher = new TeamsFetcher();

            // Wait for the auto-fetch to complete
            await new Promise(resolve => setTimeout(resolve, 0));

            expect(window.axios.get).toHaveBeenCalledWith('/api/teams');
        });

        it('should not auto-fetch when autoFetch is false', () => {
            const fetcher = new TeamsFetcher({ autoFetch: false });

            expect(window.axios.get).not.toHaveBeenCalled();
        });
    });

    describe('fetch()', () => {
        it('should fetch teams successfully', async () => {
            const mockTeams = [
                { id: 1, name: 'Team A' },
                { id: 2, name: 'Team B' }
            ];

            window.axios.get.mockResolvedValue({
                data: {
                    success: true,
                    data: mockTeams
                }
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });
            const result = await fetcher.fetch();

            expect(window.axios.get).toHaveBeenCalledWith('/api/teams');
            expect(fetcher.teams).toEqual(mockTeams);
            expect(result).toEqual(mockTeams);
            expect(fetcher.loading).toBe(false);
            expect(fetcher.error).toBe(null);
        });

        it('should set loading state during fetch', () => {
            window.axios.get.mockImplementation(() => {
                return new Promise(() => {}); // Never resolves
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });
            fetcher.fetch();

            expect(fetcher.loading).toBe(true);
        });

        it('should call onSuccess callback when fetch succeeds', async () => {
            const mockTeams = [{ id: 1, name: 'Team A' }];
            const onSuccess = jest.fn();

            window.axios.get.mockResolvedValue({
                data: {
                    success: true,
                    data: mockTeams
                }
            });

            const fetcher = new TeamsFetcher({
                autoFetch: false,
                onSuccess
            });

            await fetcher.fetch();

            expect(onSuccess).toHaveBeenCalledWith(mockTeams);
        });

        it('should handle API errors', async () => {
            const mockError = new Error('Network error');
            window.axios.get.mockRejectedValue(mockError);

            const fetcher = new TeamsFetcher({ autoFetch: false });

            await expect(fetcher.fetch()).rejects.toThrow('Network error');
            expect(fetcher.error).toBe(mockError);
            expect(fetcher.loading).toBe(false);
        });

        it('should call onError callback when fetch fails', async () => {
            const mockError = new Error('Network error');
            const onError = jest.fn();

            window.axios.get.mockRejectedValue(mockError);

            const fetcher = new TeamsFetcher({
                autoFetch: false,
                onError
            });

            await expect(fetcher.fetch()).rejects.toThrow();
            expect(onError).toHaveBeenCalledWith(mockError);
        });

        it('should handle invalid response format', async () => {
            window.axios.get.mockResolvedValue({
                data: {
                    success: false
                }
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });

            await expect(fetcher.fetch()).rejects.toThrow('Invalid response format');
            expect(fetcher.error).toBeTruthy();
        });
    });

    describe('getTeams()', () => {
        it('should return cached teams', async () => {
            const mockTeams = [{ id: 1, name: 'Team A' }];

            window.axios.get.mockResolvedValue({
                data: {
                    success: true,
                    data: mockTeams
                }
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });
            await fetcher.fetch();

            expect(fetcher.getTeams()).toEqual(mockTeams);
        });

        it('should return empty array before fetch', () => {
            const fetcher = new TeamsFetcher({ autoFetch: false });

            expect(fetcher.getTeams()).toEqual([]);
        });
    });

    describe('isLoading()', () => {
        it('should return false initially', () => {
            const fetcher = new TeamsFetcher({ autoFetch: false });

            expect(fetcher.isLoading()).toBe(false);
        });

        it('should return true during fetch', () => {
            window.axios.get.mockImplementation(() => {
                return new Promise(() => {}); // Never resolves
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });
            fetcher.fetch();

            expect(fetcher.isLoading()).toBe(true);
        });
    });

    describe('getError()', () => {
        it('should return null initially', () => {
            const fetcher = new TeamsFetcher({ autoFetch: false });

            expect(fetcher.getError()).toBe(null);
        });

        it('should return error after failed fetch', async () => {
            const mockError = new Error('API Error');
            window.axios.get.mockRejectedValue(mockError);

            const fetcher = new TeamsFetcher({ autoFetch: false });

            try {
                await fetcher.fetch();
            } catch (e) {
                // Expected to throw
            }

            expect(fetcher.getError()).toBe(mockError);
        });
    });

    describe('refresh()', () => {
        it('should re-fetch teams', async () => {
            const mockTeams = [{ id: 1, name: 'Team A' }];

            window.axios.get.mockResolvedValue({
                data: {
                    success: true,
                    data: mockTeams
                }
            });

            const fetcher = new TeamsFetcher({ autoFetch: false });
            await fetcher.refresh();

            expect(window.axios.get).toHaveBeenCalledWith('/api/teams');
            expect(fetcher.teams).toEqual(mockTeams);
        });
    });
});
