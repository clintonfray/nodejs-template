require('dotenv').config()
// require('./config/appdynamics.js');


const express = require('express');
const cors = require('cors')
const helmet = require("helmet");
const morgan = require("morgan")
const rateLimit = require("express-rate-limit")

const productRoutes = require('./routes/products.js')

const limiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Too many connections from this IP, please try again after a minute"
});

/**
 * Import the database connection file.
 */
const db = require("./config/database");

app = express();
env = process.env;

// Middleware
app.use(morgan("common")) //just for logs
app.use(helmet());
app.use(cors());
app.use(limiter);
app.use(express.urlencoded({extended: true}));
app.use(express.json());

/**
 * Liveness Probe
 **/
app.use('/health', (req, res)=>res.send('Health OK'));


/**
 * Application Routes
 **/

app.use('/api/products', productRoutes);


/**
 * Create a anonymous function to establish the database connection.
 * After the connection is established, start the server.
 */
const initApp = async () => {
    console.log("Testing the database connection..");
    /**
     * Test the connection.
     * You can use the .authenticate() function to test if the connection works.
     */
    try {
        await db.authenticate();
        console.log("Connection has been established successfully.");

        /**
         * Start the web server on the specified port.
         */
        app.listen(env.PORT || 8088, env.HOST, () => {
            console.log(`Server is up and running at: http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Unable to connect to the database:", error.original);
    }
};

/**
 * Initialize the application.
 */
initApp();
