const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();
const app = express();
const port = 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w8sm0.mongodb.net/${process.env.DB_NAME}`;

app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("cellPhoneShop").collection("products");
  const ordersCollection = client.db("cellPhoneShop").collection("orders");
    console.log('Database connected');
    
    app.post('/addEvent', (req, res)=>{
        const product = req.body;
        collection.insertOne(product)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })
    
    app.get('/products', (req, res)=>{
        collection.find({}).toArray((err, documents)=>{
            res.send(documents);
        })
    })

    app.get('/product/:price', (req, res)=>{
      collection.find({price: req.params.price}).toArray((err, documents)=>{
          res.send(documents[0]);
      })
  })

    
    app.post('/addOrder', (req, res)=>{
        const order = req.body;
        ordersCollection.insertOne(order)
        .then(result=>{
            console.log(result.insertedCount);
            res.send(result.insertedCount);
        })
    })

    app.get('/orderPlacedByEmail', (req, res)=>{
      ordersCollection.find({email: req.query.email}).toArray((err, documents)=>{
          res.send(documents);
      })
  })
   

});

console.log(process.env.DB_USER)

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
