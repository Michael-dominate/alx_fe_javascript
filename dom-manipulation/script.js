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
    
    // Start periodic sync
    setInterval(syncWithServer, SYNC_INTERVAL);
}

// Load data from local storage or server
async function loadData() {
    const localQuotes = localStorage.getItem('quotes');
    const localCategory = localStorage.getItem('selectedCategory');
    
    if (localQuotes) {
        quotes = JSON.parse(localQuotes);
        selectedCategory = localCategory || 'all';
        pendingChanges = false;
    }
    
    try {
        await syncWithServer();
    } catch (error) {
        updateSyncStatus('Failed to sync with server', 'error');
        console.error('Sync error:', error);
    }
}

// Save data to local storage
function saveData() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('selectedCategory', selectedCategory);
    pendingChanges = true;
    updateSyncStatus('Local changes not yet synced', 'warning');
}

// Sync with mock server
async function syncWithServer() {
    try {
        updateSyncStatus('Syncing with server...', 'info');
        
        // Simulate fetching from server
        const response = await fetch(SERVER_URL);
        const serverData = await response.json();
        
        // Transform mock data to our quote format
        const serverQuotes = serverData.slice(0, 5).map(post => ({
            text: post.title,
            category: `Server-${post.userId}`
        }));
        
        // Merge with local quotes
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);
        
        // Only update if there are changes
        if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
            quotes = mergedQuotes;
            saveData();
            updateSyncStatus('Data updated from server', 'success');
            populateCategories();
            showRandomQuote();
        } else if (!pendingChanges) {
            updateSyncStatus('Synced with server', 'success');
        }
        
        lastSyncTime = new Date();
    } catch (error) {
        updateSyncStatus('Sync failed', 'error');
        throw error;
    }
}

// Merge local and server quotes (simple conflict resolution)
function mergeQuotes(localQuotes, serverQuotes) {
    // Create a map of quotes by text for quick lookup
    const quoteMap = new Map();
    
    // Add server quotes first (server takes precedence)
    serverQuotes.forEach(quote => {
        quoteMap.set(quote.text, quote);
    });
    
    // Add local quotes if they don't exist on server
    localQuotes.forEach(quote => {
        if (!quoteMap.has(quote.text)) {
            quoteMap.set(quote.text, quote);
        }
    });
    
    return Array.from(quoteMap.values());
}

// Update sync status UI
function updateSyncStatus(message, type) {
    syncStatus.textContent = `Status: ${message}`;
    syncStatus.className = `sync-status ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
        setTimeout(() => {
            if (syncStatus.textContent.includes(message)) {
                syncStatus.textContent = pendingChanges 
                    ? 'Status: Local changes not yet synced' 
                    : 'Status: Synced';
                syncStatus.className = `sync-status ${pendingChanges ? 'warning' : 'success'}`;
            }
        }, 3000);
    }
}

// [Previous functions: populateCategories, applySavedFilter, filterQuotes, 
//  displayQuote, showRandomQuote, createAddQuoteForm, exportToJsonFile, 
//  importFromJsonFile remain the same as in previous implementation]

// Start the application
init();