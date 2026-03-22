require('dotenv').config();
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const authJwtController = require('./auth_jwt'); // You're not using authController, consider removing it
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./Users');
const Movie = require('./Movies'); // You're not using Movie, consider removing it

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(passport.initialize());

// Connection to MongoDB
mongoose.connect(process.env.DB)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err))

const router = express.Router();

// Removed getJSONObjectForMovieRequirement as it's not used

router.post('/signup', async (req, res) => { // Use async/await
  if (!req.body.username || !req.body.password || !req.body.email) {
    return res.status(400).json({ success: false, msg: 'Please include both username, email, and password to signup.' }); // 400 Bad Request
  }

  try {
    const user = new User({ // Create user directly with the data
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save(); // Use await with user.save()

    res.status(201).json({ success: true, msg: 'Successfully created new user.' }); // 201 Created
  } catch (err) {
    if (err.code === 11000) { // Strict equality check (===)
      return res.status(409).json({ success: false, message: 'A user with that username or email already exists.' }); // 409 Conflict
    } else {
      console.error(err); // Log the error for debugging
      return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
    }
  }
});

router.post('/signin', async (req, res) => { // Use async/await
  try {
    // User can use email or username to login
    const user = await User.findOne({ 
      $or: [
        { username: req.body.username }, 
        { email: req.body.username }
      ]
    }).select('name username email password');

    if (!user) {
      return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' }); // 401 Unauthorized
    }

    const isMatch = await user.comparePassword(req.body.password); // Use await

    if (isMatch) {
      const userToken = { id: user._id, username: user.username }; // Use user._id (standard Mongoose)
      const token = jwt.sign(userToken, process.env.SECRET_KEY, { expiresIn: '1h' }); // Add expiry to the token (e.g., 1 hour)
      res.json({ success: true, token: 'JWT ' + token });
    } else {
      res.status(401).json({ success: false, msg: 'Authentication failed. Incorrect password.' }); // 401 Unauthorized
    }
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' }); // 500 Internal Server Error
  }
});

router.route('/movies')
    .get(authJwtController.isAuthenticated, async (req, res) => {
      try {
        const movies = await Movie.find({});
        res.status(200).json({ success: true, movies });
      }
      catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error fetching movies'});
      }
    })
    .post(authJwtController.isAuthenticated, async (req, res) => {
      try {
        const { title, releaseDate, genre, actors } = req.body;

        // Validate required fields 
        if (!title) {
          return res.status(400).json({ success: false, message: 'Title is required'});
        }
        if (!releaseDate) {
          return res.status(400).json({ success: false, message: 'Release date is required'});
        }
        if (!genre) {
          return res.status(400).json({ success: false, message: 'Genre is required'});
        }
        if (!actors || actors.length < 3) {
          return res.status(400).json({ success: false, message: 'At least 3 actors are required'});
        }

        // Validate each actor has required fields 
        for (let i = 0; i < actors.length; i++) {
          if (!actors[i].actorName || !actors[i].characterName) {
            return res.status(400).json({
              success: false, 
              message: `Actor ${i + 1} must have both actorName and characterName`
            });
          }
        }

        const movie = new Movie({ title, releaseDate, genre, actors });
        await movie.save();

        res.status(201).json({ success: true, message: 'Movie saved successfully', movie });
      }
      catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Error saving movie', error: err.message });
      }
    })
    .put((req, res) => {
      res.status(405).json({ success: false, message: 'PUT method not allowed on /movies. Use /movies/:title instead'});
    })
    .delete((req, res) => {
      res.status(405).json({ success: false, message: 'DELETE method not allowed on /movies. Use /movies/:title instead' });
    });

// GET, PUT, DELETE for specific movie title 
router.route('/movies/:title')
  .get(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movie = await Movie.findOne({ title: req.params.title });
      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }
      res.status(200).json({ success: true, movie });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error fetching movie' });
    }
  })
  .put(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const { title, releaseDate, genre, actors } = req.body;

      // Validate actors if provided
      if (actors && actors.length < 3) {
        return res.status(400).json({ success: false, message: 'At least 3 actors are required' });
      }

      const movie = await Movie.findOneAndUpdate(
        { title: req.params.title },
        { title, releaseDate, genre, actors },
        {new: true, runValidators: true }
      );

      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      res.status(200).json({ success: true, message: 'Movie updated successfully', movie });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error updating movie', error: err.message });
    }
  })
  .delete(authJwtController.isAuthenticated, async (req, res) => {
    try {
      const movie = await Movie.findOneAndDelete({ title: req.params.title });

      if (!movie) {
        return res.status(404).json({ success: false, message: 'Movie not found' });
      }

      res.status(200).json({ success: true, message: 'Movie deleted successfully' });
    }
    catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: 'Error deleting movie', error: err.message })
    }
  })
  .post((req, res) => {
    res.status(405).json({ success: false, message: 'POST method not allowed on /movies/:title. Use /movies instead' });
  });

// Root route
router.get('/', (req, res) => {
  res.json({
    message: 'CSC3916 Assignment 3: Movies API',
    endpoints: {
      signup: 'POST /signup',
      signin: 'POST /signin',
      movies: {
        getAll: 'GET /movies',
        getOne: 'GET /movies/:title',
        create: 'POST /movies',
        update: 'PUT /movies/:title',
        delete: 'DELETE /movies/:title'
      }
    }
  });
});

app.use('/', router);

const PORT = process.env.PORT || 8080; // Define PORT before using it
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app; // for testing only