const express = require('express');
const app = express();
const path = require('path');

// connect to mongoose
const mongoose = require('mongoose');
const Campground = require('./models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// tell express to parse the request body
app.use(express.urlencoded({ extended: true }));

// initiate the basic route
app.get('/', (req, res) => {
    // render the home page from the view
    res.render('home');
});

// initiate the route for a list to show campground showing up
app.get('/campgrounds', async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', { allCampgrounds });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// create new campground
app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
});
app.get('/campgrounds/:id', async (req, res) => {
    const tarCampground = await Campground.findById(req.params.id);
    res.render('campgrounds/detail', { tarCampground });
});

// define the port
app.listen(3000, () => {
    console.log('Serving on port 3000');
});
