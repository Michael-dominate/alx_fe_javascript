
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Be the change that you wish to see in the world.", category: "Wisdom" },
    { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');


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
}


function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.className = 'add-quote-form';
    
    formContainer.innerHTML = `
        <h3>Add Your Own Quote</h3>
        <input id="newQuoteText" type="text" placeholder="Enter quote text">
        <input id="newQuoteCategory" type="text" placeholder="Enter category">
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
        document.getElementById('newQuoteText').value = "";
        document.getElementById('newQuoteCategory').value = "";
        alert("Quote added successfully!");
        showRandomQuote();
    });
}


function init() {
    showRandomQuote();
    createAddQuoteForm();
    
    
    newQuoteBtn.addEventListener('click', showRandomQuote);
}

init();