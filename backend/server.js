const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoutes = require('./routes/userRoutes'); // Import the user routes


const path = require('path');//added new 

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json()); // For parsing application/json


app.use(express.static(path.join(__dirname, 'routes')));//new for html file

// Use the user routes
app.use('/user', userRoutes); // All user routes will be prefixed with /user

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
