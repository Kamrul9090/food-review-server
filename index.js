const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, CURSOR_FLAGS, ObjectId } = require('mongodb');
require('dotenv').config()

const port = process.env.PORT || 5000;

const app = express()

app.use(cors())
app.use(express.json())




const uri = process.env.REACT_APP_uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const AllServicesCollection = client.db('FoodsReview').collection('AllServices');
        const categoryCollection = client.db("FoodsReview").collection('CategoryFoods')
        const blogsCollection = client.db('FoodsReview').collection('blogs')
        // Get request 
        app.get('/AllServices', async (req, res) => {
            const query = {};
            const AllFoodsData = AllServicesCollection.find(query);
            const result = await AllFoodsData.limit(3).toArray();
            if (result) {
                return res.send(result)
            } else {
                return res.send({ message: "Not found" });
            }
        })

        app.get('/AllFoods', async (req, res) => {
            const query = {};
            const AllFoodsData = await AllServicesCollection.find(query).toArray();
            if (AllFoodsData) {
                return res.send(AllFoodsData)
            } else {
                return res.send({ message: "Data Not found" })
            }
        })

        app.get('/foods', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            res.send(result);
        })

        // Get details id data
        app.get('/details/:id', async (req, res) => {
            const id = req.params.id;
            const cursor = { _id: new ObjectId(id) }
            const result = await AllServicesCollection.findOne(cursor);
            res.send(result)
        })
        app.get('/blogs', async (req, res) => {
            const query = {};
            const result = await blogsCollection.find(query).toArray();
            res.send(result);
        })

        app.post('/blogs', async (req, res) => {
            const data = req.body;
            console.log(data);
            const result = await blogsCollection.insertOne(data);
            if (result.acknowledged) {
                res.send({ message: "Your blog completely Submit" })
            } else {
                res.send({ error: "It's Not submit. Try again" });
            }
        })
    }
    finally {

    }
}

run().catch(e => console.error(e))


app.get('/', (req, res) => {
    res.send('server open on port 5000');
})

app.listen(port, () => {
    console.log(`server open on port ${port}`);
})