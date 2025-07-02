
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Be the change that you wish to see in the world.", category: "Wisdom" },
    { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const quoteTextInput = document.getElementById('newQuoteText');
const quoteCategoryInput = document.getElementById('newQuoteCategory');

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


function addQuote() {
    const text = quoteTextInput.value.trim();
    const category = quoteCategoryInput.value.trim();
    
  
    if (!text || !category) {
        alert("Please enter both quote text and category");
        return;
    }
    
    
    const newQuote = {
        text: text,
        category: category
    };
    
    
    quotes.push(newQuote);
    
  
    quoteTextInput.value = "";
    quoteCategoryInput.value = "";
    
    
    alert("Quote added successfully!");
    
    
    quoteDisplay.innerHTML = `
        <p class="quote-text">"${newQuote.text}"</p>
        <p class="quote-category">— ${newQuote.category}</p>
    `;
}


newQuoteBtn.addEventListener('click', showRandomQuote);


showRandomQuote();