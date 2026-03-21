require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('./')); // Serve frontend files from root

const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || 'sandbox';

const configuration = new Configuration({
    basePath: PlaidEnvironments[PLAID_ENV],
    baseOptions: {
        headers: {
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
        },
    },
});

const client = new PlaidApi(configuration);

// --- API ENDPOINTS ---

// 1. Create a Link Token
app.post('/api/create_link_token', async (req, res) => {
    try {
        const response = await client.linkTokenCreate({
            user: { client_user_id: 'user-id-2026' },
            client_name: 'AskJuthis Mortgages',
            products: process.env.PLAID_PRODUCTS.split(','),
            country_codes: process.env.PLAID_COUNTRY_CODES.split(','),
            language: 'en',
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error creating link token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

// 2. Exchange Public Token for Access Token
app.post('/api/exchange_public_token', async (req, res) => {
    const { public_token } = req.body;
    try {
        const response = await client.itemPublicTokenExchange({
            public_token: public_token,
        });
        const accessToken = response.data.access_token;
        const itemID = response.data.item_id;
        
        // In a real app, store accessToken and itemID securely!
        console.log('Success! Item Linked:', itemID);
        
        res.json({
            status: 'success',
            item_id: itemID
        });
    } catch (error) {
        console.error('Error exchanging token:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Plaid Backend active at http://localhost:${PORT}`);
    console.log(`To start real-world bank linking, click the button in your portal.`);
});
