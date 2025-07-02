// Quotes array with text and category properties
let quotes = [];
let currentFilter = 'all';

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

// Initialize the application
function init() {
    loadQuotes();
    populateCategories();
    applySavedFilter();
    showRandomQuote();
    createAddQuoteForm();
    
    // Event listeners
    newQuoteBtn.addEventListener('click', showRandomQuote);
    exportBtn.addEventListener('click', exportToJsonFile);
    importFile.addEventListener('change', importFromJsonFile);
    categoryFilter.addEventListener('change', filterQuotes);
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
        // Default quotes
        quotes = [
            { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
            { text: "Life is what happens when you're busy making other plans.", category: "Life" },
            { text: "In the middle of difficulty lies opportunity.", category: "Motivation" }
        ];
        saveQuotes();
    }
}

// Save quotes to local storage
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
    localStorage.setItem('lastFilter', currentFilter);
    sessionStorage.setItem('lastUpdate', new Date().toISOString());
}

// Populate categories dropdown
function populateCategories() {
    // Get unique categories
    const categories = ['all', ...new Set(quotes.map(quote => quote.category))];
    
    // Clear existing options
    categoryFilter.innerHTML = '';
    
    // Add new options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category === 'all' ? 'All Categories' : category;
        categoryFilter.appendChild(option);
    });
}

// Apply saved filter from localStorage
function applySavedFilter() {
    const savedFilter = localStorage.getItem('lastFilter');
    if (savedFilter) {
        currentFilter = savedFilter;
        categoryFilter.value = currentFilter;
    }
}

// Filter quotes by category
function filterQuotes() {
    currentFilter = categoryFilter.value;
    saveQuotes(); // Save the current filter
    
    if (currentFilter === 'all') {
        showRandomQuote();
    } else {
        const filteredQuotes = quotes.filter(quote => quote.category === currentFilter);
        if (filteredQuotes.length > 0) {
            const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
            displayQuote(filteredQuotes[randomIndex]);
        } else {
            quoteDisplay.innerHTML = `<p>No quotes found in ${currentFilter} category</p>`;
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

    const filteredQuotes = currentFilter === 'all' 
        ? quotes 
        : quotes.filter(quote => quote.category === currentFilter);
    
    if (filteredQuotes.length === 0) {
        quoteDisplay.innerHTML = `<p>No quotes found in ${currentFilter} category</p>`;
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
        
        quotes.push({ text, category });
        saveQuotes();
        populateCategories(); // Update categories dropdown
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
                quotes.push(...importedQuotes);
                saveQuotes();
                populateCategories(); // Update categories dropdown
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