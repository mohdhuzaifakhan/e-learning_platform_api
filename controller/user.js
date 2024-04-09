// user.controller.js

const User = require('../models/user');
const localStrategy = require('passport-local');
const passport = require('passport');
passport.use(new localStrategy(User.authenticate()));

// const cloudinary = require('cloudinary').v2;
// const configuration = require('../config/cloudnary')
// configuration();
// Function to register a new user


async function registerUser(req, res) {

  try {
    console.log(req.body)
    var userData = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.email
    })

    User.register(userData, req.body.password, function (err, user) {
      if (err) {
        console.log(err);
      }
      console.log("register successful")
      res.send("register successful")
      passport.authenticate('local')(req, res, function () {
        res.redirect('/')
      })
    })


  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}

// Function to login a user
async function loginUser(req, res) {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    if (password !== user.password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function updateProfilePicture(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById({ _id: userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    // Update user's profile picture
    user.profilePicture = file.originalname;
    await user.save();
    res.json({ message: "Profile picture updated successfully", avatar: file.originalname });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
}


async function updateProfile(req, res) {
  try {
    const _id = req.user._id;

    if (_id == null) {
      res.send("user not found");
    }

    const update = req.body;
    const options = { new: true };
    const result = await User.findByIdAndUpdate(_id, update, options);
    res.send(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

async function getUser(req, res) {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

module.exports = {
  registerUser,
  loginUser,
  updateProfile,
  getUser,
  updateProfilePicture
};
