/**
 * TeamsFetcher Component
 *
 * Fetches teams from the API but doesn't necessarily render the data.
 * Can be used for pre-loading data, caching, or background fetching.
 */
class TeamsFetcher {
    constructor(options = {}) {
        this.apiUrl = options.apiUrl || '/api/teams';
        this.autoFetch = options.autoFetch !== false;
        this.onSuccess = options.onSuccess || null;
        this.onError = options.onError || null;
        this.teams = [];
        this.loading = false;
        this.error = null;

        if (this.autoFetch) {
            this.fetch();
        }
    }

    /**
     * Fetch teams from the API
     * @returns {Promise<Array>} The teams data
     */
    async fetch() {
        this.loading = true;
        this.error = null;

        try {
            const response = await window.axios.get(this.apiUrl);

            if (response.data && response.data.success) {
                this.teams = response.data.data;

                if (this.onSuccess) {
                    this.onSuccess(this.teams);
                }

                return this.teams;
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error) {
            this.error = error;
            console.error('Error fetching teams:', error);

            if (this.onError) {
                this.onError(error);
            }

            throw error;
        } finally {
            this.loading = false;
        }
    }

    /**
     * Get the cached teams data
     * @returns {Array} The teams data
     */
    getTeams() {
        return this.teams;
    }

    /**
     * Check if currently loading
     * @returns {boolean}
     */
    isLoading() {
        return this.loading;
    }

    /**
     * Get the last error if any
     * @returns {Error|null}
     */
    getError() {
        return this.error;
    }

    /**
     * Refresh the teams data
     * @returns {Promise<Array>}
     */
    refresh() {
        return this.fetch();
    }
}

export default TeamsFetcher;
