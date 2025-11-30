const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require('cookie-parser');
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5001;

// middle Ware
app.use(cors({
  origin: ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const logger = (req, res, next)=>{
  console.log('inside the logger middleware');
  next();
}

const verifyToken = (req, res, next)=>{
  const token = req?.cookies?.token;
  console.log('cookie in the middleWare',token);
  if (!token) {
    return res.status(401).send({message: 'unauthorized access'})
  }
  //verify token
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, decoded)=>{
    if (err) {
      return res.status(401).send({message: 'unauthorized access'})
    }
    req.decoded = decoded;
      next();
    
  })

  
}

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uw5xzgl.mongodb.net/?appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const jobsCollections = client.db("careerCode").collection("jobs");
    const applicationCollection = client
      .db("careerCode")
      .collection("applications");
    // jwt web token related API
    app.post("/jwt", async(req, res) => {
      const userData= req.body;
      const token = jwt.sign(userData, process.env.JWT_ACCESS_SECRET, { expiresIn: "1d" });
      // set token in the cookies
      res.cookie('token', token,{
        httpOnly: true,
        secure: false
      })
      res.send({ success: true });
    });

    //Find jobs API
    app.get("/jobs", async (req, res) => {
      const email = req.query.email;
      const query = {};
      if (email) {
        query.hr_email = email;
      }

      const cursor = jobsCollections.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // findOne jobs API
    app.get("/jobs/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await jobsCollections.findOne(query);
      res.send(result);
    });
    // insert jobs
    app.post("/jobs", async (req, res) => {
      const newJobs = req.body;
      const result = await jobsCollections.insertOne(newJobs);
      res.send(result);
    });

    app.get("/applications", logger, verifyToken, async (req, res) => {
      const email = req.query.email;

      // console.log('inside application API',req.cookies);
      if (email !== req.decoded.email) {
        return res.status(403).send({message: 'forbidden access'})
      }
      
 
      const query = {
        applicant: email,
      };
      const result = await applicationCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/applications/job/job_id", async (req, res) => {
      const job_id = req.params.job_id;
      const query = { jobId: job_id };
      const result = await applicationCollection.find(query).toArray();
      res.send(result);
    });
    //application post API
    app.post("/application", async (req, res) => {
      const application = req.body;
      const result = await applicationCollection.insertOne(application);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Career code is running");
});

app.listen(port, () => {
  console.log(`Career code is running on port ${port}`);
});
