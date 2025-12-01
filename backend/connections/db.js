
const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://3qu1p0-2:I4V42Bv9rUj2vOde@cluster0.gwb4srn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
/*,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })*/
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('Error connected to MongoDB Atlas:', err));

module.exports = mongoose;


/*const uri = "mongodb+srv://3qu1p0-2:I4V42Bv9rUj2vOde@cluster0.gwb4srn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Se conectó correctamente a MongoDB!!!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);*/
