
const quotes = [
    "Be yourself; everyone else is already taken. - Oscar Wilde",
    "You only live once, but if you do it right, once is enough. - Mae West",
    "The purpose of our lives is to be happy. - Dalai Lama",
    "Life is what happens when you're busy making other plans. - John Lennon",
    "Live life to the fullest. - Unknown"
];


const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');


function showRandomQuote() {
    
    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    
    quoteDisplay.textContent = quotes[randomIndex];
}


function addQuote() {
    
    const quoteText = document.getElementById('newQuoteText').value;
    const quoteAuthor = document.getElementById('newQuoteCategory').value;
    
    
    if (quoteText && quoteAuthor) {
        
        const newQuote = `${quoteText} - ${quoteAuthor}`;
        
        
        quotes.push(newQuote);
        
        
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        
        
        alert('Quote added successfully!');
        
        
        quoteDisplay.textContent = newQuote;
    } else {
        alert('Please fill in both fields!');
    }
}


showRandomQuote();


newQuoteBtn.addEventListener('click', showRandomQuote);