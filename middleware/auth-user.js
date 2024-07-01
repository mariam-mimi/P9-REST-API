'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs'); // Needed for password hashing
const { User } = require('../models');


// Uses Basic Authentication in Middleware function to authenticate the request.
 
exports.authenticateUser = async (req, res, next) => {
  let message;

  const credentials = auth(req);
// Finds user with provided email address
  if (credentials) {
    const user = await User.findOne({ where: {emailAddress: credentials.name} });
    if (user) {
      const authenticated = bcrypt.compareSync(credentials.pass, user.password);
      if (authenticated) {
        console.log(`Authentication successful for user: ${user.emailAddress}`);
        req.currentUser = user;
      } else {
        // Flags when password is incorrect
        message = `Authentication failure for user: ${user.emailAddress}`;
      }
    } else {
        // Flags when the email isn't found
      message = `User not found for email address: ${credentials.name}`;
    }
  } else {
    message = 'Auth header not found';
  }

  // Doesn't give access if authentication failure occurs
  if (message) {
    console.warn(message);
    res.status(401).json({ message: 'Access Denied' });
  } else {
    next();
  }
};