
const quotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "In the middle of difficulty lies opportunity.", category: "Motivation" },
    { text: "Be the change that you wish to see in the world.", category: "Wisdom" },
    { text: "It does not matter how slowly you go as long as you do not stop.", category: "Perseverance" }
];


const quoteTextElement = document.getElementById('quote-text');
const quoteCategoryElement = document.getElementById('quote-category');
const newQuoteBtn = document.getElementById('new-quote-btn');
const quoteTextInput = document.getElementById('quote-text-input');
const quoteCategoryInput = document.getElementById('quote-category-input');
const addQuoteBtn = document.getElementById('add-quote-btn');


function displayRandomQuote() {
    
    if (quotes.length === 0) {
        quoteTextElement.textContent = "No quotes available";
        quoteCategoryElement.textContent = "";
        return;
    }

    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    
    quoteTextElement.textContent = `"${randomQuote.text}"`;
    quoteCategoryElement.textContent = `— ${randomQuote.category}`;
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
    
    
    quoteTextElement.textContent = `"${newQuote.text}"`;
    quoteCategoryElement.textContent = `— ${newQuote.category}`;
}


newQuoteBtn.addEventListener('click', displayRandomQuote);
addQuoteBtn.addEventListener('click', addQuote);


displayRandomQuote();