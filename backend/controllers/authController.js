const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.signup = async (req, res) => {
  const { username, password } = req.body;

 // Validation for username (only alphanumeric) and password length
 const usernameRegex = /^[a-zA-Z0-9]+$/;

 if (!usernameRegex.test(username)) {
   return res.status(400).json({ message: 'Username can only contain alphanumeric characters' });
 }

 if (password.length <6) {
   return res.status(400).json({ message: 'Password should be at least 6 characters long' });
 }


  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.findOne({ username });
  if(user){
    return res.status(400).json({ message: 'User already exists' });
  }
  const newUser = new User({ username, password: hashedPassword });
  await newUser.save();
  res.status(201).json({ message: 'User created! You can now log in.' });
};



// User Login
exports.login = async (req, res) => {
  const { username, password } = req.body;

   // Validation for username (only alphanumeric) and password length
   const usernameRegex = /^[a-zA-Z0-9]+$/;

  
   if (!usernameRegex.test(username)) {
     return res.status(400).json({ message: 'Username can only contain alphanumeric characters' });
   }
 
   if (password.length <6) {
     return res.status(400).json({ message: 'Password should be at least 6 characters long' });
   }


  const user = await User.findOne({ username });

  if (!user) return res.status(400).json({ message: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ "token":token ,"username":username,message: 'User Login successfully'});
};
