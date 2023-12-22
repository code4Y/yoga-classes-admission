const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
require('dotenv').config();



const app = express();
const port = 3000;

// Enable CORS to allow routes
app.use(cors({
  origin: "https://yoga-classes-admission.vercel.app",
  methods: ["POST", "GET", "PUT"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(bodyParser.json());


// API endpoints

// Test for server on Vercel
app.get("/", async (req, res) => {
  res.send("API Server is running");
})


// User registration logic
app.post('/api/register', async (req, res) => {
  const { name, age, email, password, batchid } = req.body;

  try {
    // Check if email already exists
    const emailExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (emailExists.rows.length > 0) {
      return res.status(400).send('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Insert new user into users table with hashed password
    const newUser = await pool.query(
      'INSERT INTO users (name, age, email, password) VALUES ($1, $2, $3, $4) RETURNING userid',
      [name, age, email, hashedPassword]
    );

    // Get UserID from the inserted record
    const userID = newUser.rows[0].userid;

    // Insert enrollment information
    const enrollment = await pool.query(
      'INSERT INTO enrollments (userid, batchid, enrollmentmonth) VALUES ($1, $2, NOW())',
      [userID, batchid]
    );

    res.status(201).json({ userID });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// User login logic
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user with the provided email exists
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password using bcrypt
    const storedPassword = user.rows[0].password;
    const passwordMatch = await bcrypt.compare(password, storedPassword);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Successful login, return user details (excluding password)
    const userDetails = {
      userID: user.rows[0].userid,
      name: user.rows[0].name,
      age: user.rows[0].age,
      email: user.rows[0].email,
      // Include other necessary user details
    };

    res.status(200).json(userDetails);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

  
// Fee payment logic
app.post('/api/pay-fee', async (req, res) => {
  const { userID } = req.body;
  const feeAmount = 500; // Assuming the fee amount is fixed

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE userid = $1', [userID]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has already paid for the current month
    const today = new Date();
    const currentMonth = today.getMonth() + 1; // Adding 1 as getMonth() returns 0-indexed month
    const paymentExists = await pool.query(
      'SELECT * FROM payments WHERE userid = $1 AND EXTRACT(MONTH FROM paymentdate) = $2',
      [userID, currentMonth]
    );

    if (paymentExists.rows.length > 0) {
      return res.status(400).json({ message: 'Payment for this month already made' });
    }

    // Process payment
    const paymentDate = today.toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
    await pool.query('INSERT INTO payments (userid, amount, paymentdate) VALUES ($1, $2, $3)',
      [userID, feeAmount, paymentDate]);

    res.status(200).json({ message: 'Payment successful' });
  } catch (error) {
    console.error('Payment error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// Batch change logic
app.put('/api/change-batch/:userID', async (req, res) => {
  const { userID } = req.params;
  const { newBatchID } = req.body;

  try {
    // Check if the user exists
    const user = await pool.query('SELECT * FROM users WHERE userid = $1', [userID]);

    if (user.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if it's the first day of the month
    const today = new Date();
    if (today.getDate() !== 1) {
      return res.status(400).json({ message: 'Batch change is allowed only on the 1st day of the month' });
    }

    // Update user's current batch for the current month
    const currentMonth = today.getMonth() + 1; // Adding 1 as getMonth() returns 0-indexed month
    await pool.query(
      'UPDATE enrollments SET batchid = $1 WHERE userid = $2 AND EXTRACT(MONTH FROM enrollmentmonth) = $3',
      [newBatchID, userID, currentMonth]
    );

    res.status(200).json({ message: 'Batch change successful from the current month' });
  } catch (error) {
    console.error('Batch change error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.listen(process.env.PORT || port, () => {
  console.log(`Server is running on port ${port}`);
});