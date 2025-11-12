import './bootstrap';
import TeamsFetcher from './components/TeamsFetcher';

// Initialize TeamsFetcher - fetches teams but doesn't display them
const teamsFetcher = new TeamsFetcher({
    autoFetch: true,
    onSuccess: (teams) => {
        console.log('Teams fetched successfully:', teams);
    },
    onError: (error) => {
        console.error('Failed to fetch teams:', error);
    }
});

// Make it globally accessible if needed
window.teamsFetcher = teamsFetcher;
