const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

// load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register User via mongoose api
// @access  Public

// send form via frontend getting request.body obj via body-parser
router.post('/register', (req, res) => {
  // mongoose method findOne and insert email
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({
        email: 'Email already exists'
      });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200', //size
        r: 'pg', // rating
        d: 'mm' // default img if user img not available
      });
      // mongoose syntax = new + modelName and then pass in data
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      // pw to be hashed
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          // save new user responding with json obj
          newUser
            .save()
            .then(user => res.json(user))
            // respond with sent object containing user info via mongoose api
            .catch(err => console.log(err));
        });
      });
    }
  });
});

// @route   GET api/users/login
// @desc    Login user / returning JWT Token
// @access  Public
// send form with email and pw
router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  // find user by email by using mongoose model promise to find one record
  User.findOne({ email }).then(user => {
    // check for user
    if (!user) {
      return res.status(404).json({ email: 'User not found' });
    }
    // check password, need bcrypt to compare as input pw is plain txt whereas stored pw is hashed
    // compare promise returns booleanm if true then return JWT token
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        res.json({ msg: 'Success' });
      } else {
        return res.status(400).json({ password: 'Password incorrect' });
      }
    });
  });
});

module.exports = router;
