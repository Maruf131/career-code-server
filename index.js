const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port =process.env.PORT || 5000;

// middle Ware
app.use(cors())
app.use(express.json())



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uw5xzgl.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollections = client.db('careerCode').collection('jobs');
    const applicationCollection = client.db('careerCode').collection('applications')
    //Find jobs API
    app.get('/jobs', async(req, res) =>{
        const cursor = jobsCollections.find();
        const result = await cursor.toArray();
        res.send(result)
    })
    // findOne jobs API
    app.get('/jobs/:id', async(req, res) =>{
        const id = req.params.id;
        const query = { _id: new ObjectId(id)};
        const result = await jobsCollections.findOne(query);
        res.send(result);
    })
    //application post API
    app.post('/application', async(req, res)=>{
        const application = req.body;
        const result = await applicationCollection.insertOne(application);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Career code is running')
})

app.listen(port, () => {
  console.log(`Career code is running on port ${port}`)
})
