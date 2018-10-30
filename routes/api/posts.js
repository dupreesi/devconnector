const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// load Validation
const validatePostInput = require('../../validation/post');

// @route   GET api/posts/test
// @desc    Tests post route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get all posts
// @access  Public
router.get('/', (req, res) => {
  Post.find()
    .sort({ date: -1 })
    .then(posts => res.json(posts))
    .catch(err => res.status(404).json({ msg: 'no posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => res.json(post))
    .catch(err => res.status(404).json({ msg: 'No post found with that Id' }));
});

// @route   POST api/posts
// @desc    Create post
// @access  Private

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //destructure --> get it out of exported function
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      //if any errors send 400 with errors object
      return res.status(400).json(errors);
    }
    const newPost = new Post({
      user: req.user.id,
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar
    });
    newPost.save().then(post => res.json(post));
  }
);

// @route   DELETE api/posts/:id
// @desc    delete post
// @access  Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(() => {
      Post.findById(req.params.id).then(post => {
        // check for post owner
        if (post.user.toString() !== req.user.id) {
          return res.status(401).json({ msg: 'User not authorised' });
        }
        // Delete
        post
          .remove()
          .then(() => res.json({ success: true }))
          .catch(err => res.status(404).json({ msg: 'No post found' }));
      });
    });
  }
);
module.exports = router;
