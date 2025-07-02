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
    manualSyncBtn.addEventListener('click', syncQuotes);
    
    // Start periodic sync
    setInterval(syncQuotes, SYNC_INTERVAL);
}

// Save data to local storage
function saveData() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('selectedCategory', selectedCategory);
    localStorage.setItem('lastSyncTime', new Date().toISOString());
    pendingChanges = false;
    updateSyncStatus('Changes saved locally', 'success');
}

// Load data from local storage
async function loadData() {
    const storedQuotes = localStorage.getItem('quotes');
    const storedCategory = localStorage.getItem('selectedCategory');
    const storedSyncTime = localStorage.getItem('lastSyncTime');
    
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
        selectedCategory = storedCategory || 'all';
        lastSyncTime = storedSyncTime ? new Date(storedSyncTime) : null;
        pendingChanges = false;
        updateSyncStatus('Loaded from local storage', 'success');
    } else {
        // Default quotes if none in storage
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
        ];
        saveData(); // This will call localStorage.setItem
    }
}

// [Rest of the functions remain the same:
// fetchQuotesFromServer, postQuotesToServer, syncQuotes, 
// mergeQuotes, updateSyncStatus, populateCategories, 
// applySavedFilter, filterQuotes, displayQuote, showRandomQuote,
// createAddQuoteForm, exportToJsonFile, importFromJsonFile]

// Start the application
init();