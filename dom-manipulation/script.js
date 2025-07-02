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
        saveData();
    }
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

// Main synchronization function
async function syncQuotes() {
    try {
        updateSyncStatus('Starting synchronization...', 'info');
        
        // Step 1: Get server quotes
        updateSyncStatus('Fetching server quotes...', 'info');
        const serverQuotes = await fetchQuotesFromServer();
        
        // Step 2: Send local changes to server
        if (pendingChanges) {
            updateSyncStatus('Sending local changes...', 'info');
            const localChanges = quotes.filter(q => !q.source || q.source === 'local');
            if (localChanges.length > 0) {
                await postQuotesToServer(localChanges);
            }
        }
        
        // Step 3: Merge quotes
        updateSyncStatus('Merging quotes...', 'info');
        const mergedQuotes = mergeQuotes(quotes, serverQuotes);
        
        // Step 4: Update if changes detected
        if (JSON.stringify(quotes) !== JSON.stringify(mergedQuotes)) {
            quotes = mergedQuotes;
            saveData();
            updateSyncStatus('Synchronization complete', 'success');
            populateCategories();
            showRandomQuote();
            pendingChanges = false;
        } else {
            updateSyncStatus('Already up to date', 'success');
        }
        
        lastSyncTime = new Date();
    } catch (error) {
        updateSyncStatus('Synchronization failed', 'error');
        console.error('Sync error:', error);
        throw error;
    }
}

// Merge local and server quotes
function mergeQuotes(localQuotes, serverQuotes) {
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

// Populate categories dropdown
function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    categoryFilter.innerHTML = '';
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : category;
        categoryFilter.appendChild(option);
    });
    
    categoryFilter.value = selectedCategory;
}

// Apply saved filter from localStorage
function applySavedFilter() {
    const savedCategory = localStorage.getItem('selectedCategory');
    if (savedCategory) {
        selectedCategory = savedCategory;
    }
}

// Filter quotes by category
function filterQuotes() {
    selectedCategory = categoryFilter.value;
    saveData();
    
    if (selectedCategory === 'all') {
        showRandomQuote();
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory);
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            displayQuote(filteredQuotes[randomIndex]);
        } else {
            quoteDisplay.innerHTML = `<p>No quotes found in ${selectedCategory} category</p>`;
        }
    }
}

// Display a specific quote
function displayQuote(quote) {
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${quote.text}"</p>
        <p class="quote-category">— ${quote.category}</p>
    `;
}

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available</p>";
        return;
    }

    const filteredQuotes = selectedCategory === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === selectedCategory);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in ${selectedCategory} category</p>`;
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    displayQuote(filteredQuotes[randomIndex]);
}

// Function to create and handle the add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'add-quote-form';
    
    formContainer.innerHTML = `
        <h3>Add Your Own Quote</h3>
        <input type="text" id="newQuoteText" placeholder="Enter quote text">
        <input type="text" id="newQuoteCategory" placeholder="Enter category">
        <button id="addQuoteBtn">Add Quote</button>
    `;
    
    document.body.appendChild(formContainer);
    
    document.getElementById('addQuoteBtn').addEventListener('click', function() {
        const text = document.getElementById('newQuoteText').value.trim();
        const category = document.getElementById('newQuoteCategory').value.trim();
        
        if (!text || !category) {
            alert("Please enter both quote text and category");
            return;
        }
        
        quotes.push({ text, category, source: 'local' });
        saveData();
        populateCategories();
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
        showRandomQuote();
    });
}

// Export quotes to JSON file using Blob
function exportToJsonFile() {
    const data = JSON.stringify(quotes, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import quotes from JSON file
function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes.push(...importedQuotes.map(q => ({ ...q, source: 'local' })));
                saveData();
                populateCategories();
                alert(`${importedQuotes.length} quotes imported successfully!`);
                showRandomQuote();
            } else {
                alert("Invalid format: Expected an array of quotes");
            }
        } catch (error) {
            alert("Error parsing JSON file: " + error.message);
        }
        event.target.value = '';
    };
    fileReader.readAsText(file);
}

// Start the application
init();