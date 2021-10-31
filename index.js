const express = require("express");
const { MongoClient } = require('mongodb');
require("dotenv").config();
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

// middleware we use here
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ylakt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        // console.log('connected to database')

        const database = client.db("happyTourism");
        const servicesCollection = database.collection("places")
        const ordersCollection = database.collection("orders")

        // GET PLACES API
        app.get('/places', async (req, res) => {
            const cursor = servicesCollection.find({});
            const myPlaces = await cursor.toArray();
            res.send(myPlaces);
        })

        // GET ORDERS API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const myOrders = await cursor.toArray();
            res.json(myOrders);
        })

        // GET SINGLE PLACES
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific id', id)
            const query = { _id: ObjectId(id) }
            const place = await servicesCollection.findOne(query);
            res.json(place);

        })

        // POST places API
        app.post('/places', async (req, res) => {
            const place = req.body;
            // console.log('post hitted', place);

            const result = await servicesCollection.insertOne(place)
            res.json(result)
        })

        // POST orders API
        app.post('/orders', async (req, res) => {
            const order = req.body;

            const result = await ordersCollection.insertOne(order)
            res.json(result)
        })

        // DELETE SINGLE API places
        app.delete('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await servicesCollection.deleteOne(query);

            res.json(result)
        })

        // DELETE SINGLE API order

        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await ordersCollection.deleteOne(query);
            res.json(result)
        })


    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running tourism server');
})

app.listen(port, () => {
    console.log("running happy tourism server on port", port)
})