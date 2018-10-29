const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load profile model
const Profile = require('../../models/Profile');

// load user profile
const User = require('../../models/User');

// @route   GET api/profile/test
// @desc    Tests profile route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Profile Works' }));

// @route   GET api/profile
// @desc    Get current users profile
// @access  Private

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    // we have the user info as logged in previously
    Profile.findOne({ user: req.user.id }) // in schema user has type ID hence check against logged in ID
      .then(profile => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err => res.status(404).json(err));
  }
);

// @route   POST api/profile
// @desc    create or edit user profile
// @access  Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    console.log(req);
    // Get fields
    const profileFields = {};
    profileFields.user = req.user.id; // logged in user includes email, id, avatar, name

    if (req.body.handle) profileFields.handle = request.body.handle;
    if (req.body.company) profileFields.company = request.body.company;
    if (req.body.website) profileFields.website = request.body.website;
    if (req.body.location) profileFields.location = request.body.location;
    if (req.body.bio) profileFields.bio = request.body.bio;
    if (req.body.status) profileFields.status = request.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = request.body.githubusername;

    // skills split into array
    if (typeof req.body.skills !== 'undefined') {
      profileFields.skills = req.body.skills.split(',');
    }
    // social (own object)
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = request.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = request.body.twitter;
    if (req.body.facebook)
      profileFields.social.facebook = request.body.facebook;
    if (req.body.linkedin)
      profileFields.social.linkedin = request.body.linkedin;
    if (req.body.instagram)
      profileFields.social.instagram = request.body.instagram;

    Profile.findOne({ user: req.user.id }).then(profile => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        //create
      }
    });
  }
);

module.exports = router;
