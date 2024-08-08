const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken')//JWT
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());




// Mongo DB default code..
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.f75tpn0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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


    const TaskCollection = client.db('application').collection('tasks');
    // Add task 
    app.post('/posttask', async (req, res) => {
      const taskData = req.body;
      try {
        const result = await TaskCollection.insertOne(taskData);
        res.send(result);
      } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json('Failed to add task. Please try again.');
      }
    });
    // get task from database
    app.get('/tasks', async (req, res) => {
      try {
        const result = await TaskCollection.find().toArray();
        res.send(result);
      } catch (error) {
        console.error('Error getting task:', error);
        res.status(500).json('Failed to get task. Please try again.');
      }
    });

    // Delete Task

    app.delete('/tasks/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const deleteQuery = { _id: new ObjectId(id) };
        const result = await TaskCollection.deleteOne(deleteQuery)
        res.send(result);
      } catch (error) {
        res.status(200).send('Failed to delete task')
      }
    });

    // Update task

    app.put('/tasks/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const updatedTask = req.body;
    
        const updateQuery = { _id: new ObjectId(id) };
        const update = { $set: updatedTask };
    
        const result = await TaskCollection.updateOne(updateQuery, update);
    
        if (result.modifiedCount === 0) {
          return res.status(404).send('Task not found');
        }
    
        res.send('Task updated successfully');
      } catch (error) {
        console.error('Failed to update task:', error);
        res.status(500).send('Failed to update task');
      }
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// Mongo DB default code..end


app.get('/', (req, res) => {
  res.send('APPLICATION SERVER IS RUNNING...')
})
app.listen(port, () => {
  console.log(`APPLICATION SERVER  RUNNING ON PORT:${port}`);
})

module.exports = app;