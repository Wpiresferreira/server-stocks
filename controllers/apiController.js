import "dotenv/config";
const apiKey = process.env.API_KEY;

export async function getStockSymbols(req,res) {
    const apiUrl = `https://finnhub.io/api/v1/stock/symbol?exchange=US&token=${apiKey}`;
    const data = await fetch(apiUrl);
    const posts = await data.json();
    res.json(posts);
}

export async function getStockQuote(req, res){
    const symbol = req.params.symbol.toUpperCase();
    const apiUrl = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`;
    const data = await fetch(apiUrl);
    const posts = await data.json();
    res.json(posts);
}
export async function getStockProfile(req, res){
    const symbol = req.params.symbol.toUpperCase();
    const apiUrl = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${apiKey}`;
    const data = await fetch(apiUrl);
    const posts = await data.json();
    res.json(posts);
}
