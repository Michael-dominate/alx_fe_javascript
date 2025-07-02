// Quotes array with text and category properties
let quotes = [];

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportBtn');
const importFile = document.getElementById('importFile');

// Initialize the application
function init() {
    loadQuotes();
    showRandomQuote();
    createAddQuoteForm();
    newQuoteBtn.addEventListener('click', showRandomQuote);
    exportBtn.addEventListener('click', exportToJsonFile);
    importFile.addEventListener('change', importFromJsonFile);
}

// Load quotes from local storage
function loadQuotes() {
    const storedQuotes = localStorage.getItem('quotes');
    if (storedQuotes) {
        quotes = JSON.parse(storedQuotes);
    } else {
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
    sessionStorage.setItem('lastUpdate', new Date().toISOString());
}

// Function to show a random quote
function showRandomQuote() {
    if (quotes.length === 0) {
        quoteDisplay.innerHTML = "<p>No quotes available</p>";
        return;
    }

    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${randomQuote.text}"</p>
        <p class="quote-category">— ${randomQuote.category}</p>
    `;
    
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(randomQuote));
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