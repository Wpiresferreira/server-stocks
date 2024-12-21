import dotenv from 'dotenv' // To protect your sensible data
import express from 'express'
import { sql } from '@vercel/postgres';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';      // Middleware to parse cookies from incoming requests
import path  from 'path'; // To help the routes
import {fileURLToPath} from 'url'; // To help the routes
import cors from 'cors' // To allow test the app in the same machine
import routes from './routes/routes.js';

dotenv.config()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const origin = process.env.ORIGIN


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '.', 'components', 'home.htm'));
});
    

const app = express();
app.use(cors({ origin: origin, credentials: true,})) // Allow credentials

 app.use(express.static('public'));

// app.use(express.static(path.join(__dirname, '../frontend/dist')));


app.use(bodyParser.json())
app.use(cookieParser());  // Parse cookies attached to client requests


app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });


// Routes
app.use('/', routes);

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '.', 'components', 'home.htm'));
});
        
app.listen(5000, async () => {
    try{
        console.log ('Connected to PostgreSQL server at ' + (await sql.query(`select now()`)).rows[0].now);
        console.log('Server ready on port 5000.');
    }
    catch (error){
        console.log(error)
    }
})


// import express from 'express'
// import { sql } from '@vercel/postgres'
// import {getStockSymbols, getStockQuote, getStockProfile} from "./controllers/apiController.js"
// import routes from './routes/routes.js';
// import cookieParser from 'cookie-parser';      // Middleware to parse cookies from incoming requests
// import bodyParser from 'body-parser';





// const app = express();

// // Routes
// app.use('/', routes);
// app.use(cookieParser());  // Parse cookies attached to client requests
// app.use(bodyParser.json())

// const origin = 'http://localhost:3000'

// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", origin);
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     if (req.method === "OPTIONS") {
//       res.sendStatus(200);
//     } else {
//       next();
//     }
//   });


// // app.get('/',async function (req, res) {
// //     res.json(await getStockSymbols());
// // })
// app.get('/quote/:symbol',async function (req, res) {
//     console.log(symbol)
//     res.json(await getStockQuote(symbol.toUpperCase()));
// })
// app.get('/profile/:symbol',async function (req, res) {
    
// })

// app.listen(5000, async () => {
//     try{
//         console.log ('Connected to PostgreSQL server at ' + (await sql.query(`select now()`)).rows[0].now);
//         console.log('Server ready on port 5000.');
//     }
//     catch (error){
//         console.log(error)
//     }
// })