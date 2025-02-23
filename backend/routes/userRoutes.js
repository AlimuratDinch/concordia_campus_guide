const express = require('express');
const router = express.Router();
const supabase = require('../services/supabaseClient');
const { hashPassword } = require('../security/auth.cjs');

///////////////////

// POST route to sign in an existing user
const bcrypt = require('bcrypt'); 
const { createToken } = require('../security/jwtService.cjs'); // Import the createToken function

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Get the user by email from the Supabase database
    const { data, error } = await supabase
      .from('users')
      .select('id, password') 
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: 'User not found' });
    }

    
    console.log('Data password: ')
    console.log(data.password)
    console.log('Input password')
    console.log(password)
    const isPasswordValid = await bcrypt.compare(password, data.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Generate a JWT token for each user
    const token = createToken({ id: data.id, email: data.email });

    res.status(200).json({ message: 'Signed in successfully', token });
  } catch (err) {
    console.error('Error signing in:', err);
    res.status(500).json({ message: 'Error signing in', error: err.message });
  }
});















/////////////////////

// POST route to save a new user
router.post('/new', async (req, res) => {
  const { netname, name, email, password } = req.body;
  console.log('Working')

  if (!netname || !name || !email || !password) {
    return res.status(400).json({ message: 'NetName, Name, email, and password are required' });
  }

  try {
    // Hash password before saving
    const hashedPassword = await hashPassword(password);

    // Insert user into Supabase and return the ID
    const { data, error } = await supabase
      .from('users')
      .insert([{ netname, name, email, password: hashedPassword }])
      .select('id') // Retrieve the inserted user's ID

    if (error) {
      console.error('Error inserting user:', error);
      return res.status(500).json({ message: 'Error creating user', error });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ message: 'User created but ID not returned' });
    }

    res.status(201).json({ id: data[0].id }); // Return the user's ID
  } catch (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ message: 'Error creating user', error: err.message });
  }
});



// DELETE route to delete a user by ID
router.delete('/remove/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  const userId = BigInt(id);  // Convert to BigInt

  try {
    // Delete user by ID
    const { data, error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId)  // Use BigInt here
      .single();

    if (error) {
      console.error('Error deleting user:', error);  // Log the error details
      return res.status(500).json({ message: 'Error deleting user', error });
    }

    res.status(200).json({ message: 'User deleted successfully'});
  } catch (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ message: 'Error deleting user', error: err.message });
  }
});


module.exports = router;
