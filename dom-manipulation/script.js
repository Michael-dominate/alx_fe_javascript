
const quotes = [
    { text: "Be yourself; everyone else is already taken.", category: "wisdom" },
    { text: "You only live once, but if you do it right, once is enough.", category: "life" },
    { text: "The purpose of our lives is to be happy.", category: "inspiration" },
    { text: "Life is what happens when you're busy making other plans.", category: "life" },
    { text: "Live life to the fullest.", category: "motivation" }
];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const categoriesDiv = document.getElementById('categories');


function displayRandomQuote() {
    
    if (!quotes || quotes.length === 0) {
        quoteDisplay.textContent = "No quotes available";
        return;
    }

    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    
    quoteDisplay.innerHTML = `"${randomQuote.text}"<br><em>${randomQuote.category}</em>`;
}


function addQuote() {
    
    const textInput = document.getElementById('newQuoteText');
    const categoryInput = document.getElementById('newQuoteCategory');
    
    
    if (!textInput.value.trim() || !categoryInput.value.trim()) {
        alert("Please enter both quote text and category");
        return;
    }

    
    const newQuote = {
        text: textInput.value.trim(),
        category: categoryInput.value.trim()
    };

    
    quotes.push(newQuote);
    
    
    textInput.value = '';
    categoryInput.value = '';
    
    
    alert("Quote added successfully!");
    
    
    quoteDisplay.innerHTML = `"${newQuote.text}"<br><em>${newQuote.category}</em>`;
}


newQuoteBtn.addEventListener('click', displayRandomQuote);


displayRandomQuote();