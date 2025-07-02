// Application state
let quotes = [];
let selectedCategory = 'all';
let lastSyncTime = null;
let pendingChanges = false;

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');
const syncStatus = document.createElement('div');
syncStatus.className = 'sync-status';
const manualSyncBtn = document.getElementById('manualSync');

// Server simulation constants
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';
const SYNC_INTERVAL = 30000; // 30 seconds

// Initialize the application
async function init() {
    document.body.appendChild(syncStatus);
    await loadData();
    populateCategories();
    applySavedFilter();
    showRandomQuote();
    createAddQuoteForm();
    
    // Event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    exportBtn.addEventListener('click', exportToJsonFile);
    importFile.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
    manualSyncBtn.addEventListener('click', syncWithServer);
    
    // Start periodic sync
    setInterval(syncWithServer, SYNC_INTERVAL);
}

// Fetch quotes from mock server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(SERVER_URL);
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const serverData = await response.json();
        
        // Transform mock data to our quote format
        return serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: `Server-${post.userId}`,
            source: 'server',
            id: post.id
        }));
    } catch (error) {
        console.error('Failed to fetch quotes from server:', error);
        updateSyncStatus('Failed to fetch from server', 'error');
        throw error;
    }
}

// Send quotes to server
async function postQuotesToServer(quotesToSend) {
    try {
        const response = await fetch(SERVER_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                quotes: quotesToSend,
                timestamp: new Date().toISOString()
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('Quotes successfully posted to server:', responseData);
        return responseData;
    } catch (error) {
        console.error('Failed to post quotes to server:', error);
        updateSyncStatus('Failed to post to server', 'error');
        throw error;
    }
}

// Modified syncWithServer to include POST functionality
async function syncWithServer() {
    try {
        updateSyncStatus('Syncing with server...', 'info');
        
        // Get server quotes
        const serverQuotes = await fetchQuotesFromServer();
        
        // POST our local quotes to server (simulated)
        if (pendingChanges) {
            const localChanges = quotes.filter(q => !q.source || q.source === 'local');
            if (localChanges.length > 0) {
                await postQuotesToServer(localChanges);
            }
        }
        
        // Merge with local quotes
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);
        
        if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
            quotes = mergedQuotes;
            saveData();
            updateSyncStatus('Data synchronized', 'success');
            populateCategories();
            showRandomQuote();
            pendingChanges = false;
        } else if (!pendingChanges) {
            updateSyncStatus('Synced with server', 'success');
        }
        
        lastSyncTime = new Date();
    } catch (error) {
        updateSyncStatus('Sync failed', 'error');
        throw error;
    }
}

// [Rest of the functions remain the same as previous implementation:
// loadData, saveData, mergeQuotes, updateSyncStatus, populateCategories, 
// applySavedFilter, filterQuotes, displayQuote, showRandomQuote,
// createAddQuoteForm, exportToJsonFile, importFromJsonFile]

// Start the application
init();