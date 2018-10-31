const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

// load Model
const Post = require('../../models/Post');
const Profile = require('../../models/Profile');

// load Validation
const validatePostInput = require('../../validation/post');

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
    Profile.findOne({ user: req.user.id }).then(profile => {
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

// @route   POST api/posts/unlike/:id  --> :id is post-id
// @desc    unlike post
// @access  Private
router.post(
  '/unlike/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // check if user has already liked post
        // see if user id is included in likes array of a specific post
        // if not yet liked array.length must be 0
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length === 0
        ) {
          return res
            .status(400)
            .json({ msg: 'User has not yet liked this post' });
        }
        console.log(post.likes);

        //find index to be removed
        const removeIndex = post.likes
          .map(item => item.user.toString()) // create user id array converted to strings
          .indexOf(req.user.id); // current user

        // splice like out of array
        post.likes.splice(removeIndex, 1); // pass in removeIndex and delete 1

        // save
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(404).json({ msg: 'No post found' }));
      });
    });
  }
);

// @route   POST api/posts/like/:id
// @desc    like post
// @access  Private
router.post(
  '/like/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id }).then(profile => {
      Post.findById(req.params.id).then(post => {
        // check if user has already liked post
        // see if user id is included in likes array of a specific post
        // if not yet liked array.length must be 0
        if (
          post.likes.filter(like => like.user.toString() === req.user.id)
            .length > 0
        ) {
          return res.status(400).json({ msg: 'User already liked this post' });
        }
        // add user id to likes array, unshift puts it as first item
        post.likes.unshift({ user: req.user.id });
        // save from server into database
        post
          .save()
          .then(post => res.json(post))
          .catch(err => res.status(404).json({ msg: 'No post found' }));
      });
    });
  }
);

// @route   POST api/posts/comment/:id
// @desc    add comment to a post
// @access  Private
// find post by url params id,
router.post(
  '/comment/:id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);
    // check validation
    if (!isValid) {
      //if any errors send 400 with errors object
      return res.status(400).json(errors);
    }
    Post.findById(req.params.id).then(post => {
      const newComment = {
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
      };
      // add to comments array
      post.comments.unshift(newComment);
      // save
      post
        .save()
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ msg: 'Post not found' }));
    });
  }
);

// @route   DELETE api/posts/comment/:id/:comment_id
// @desc    remove comment from post
// @access  Private
// find post by url params id,
router.delete(
  '/comment/:id/:comment_id',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Post.findById(req.params.id)
      .then(post => {
        // check if comment exists
        if (
          post.comments.filter(
            comment => comment._id.toString() === req.params.comment_id
          ).length === 0
        ) {
          return res.status(404).json({ msg: 'comment does not exist' });
        }
        // get remove index
        const removeIndex = post.comments
          .map(item => item._id.toString())
          .indexOf(req.params.comment_id);

        // splice comment out of array
        post.comments.splice(removeIndex, 1);
        // save post
        post.save().then(post => res.json(post));
      })
      .catch(err => res.status(404).json({ msg: 'Post not found' }));
  }
);
module.exports = router;
