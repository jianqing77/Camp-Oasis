const express = require('express');
const app = express();
const path = require('path');

// connect to mongoose
const mongoose = require('mongoose');
// request override method after npm install
const methodOverride = require('method-override');
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
app.use(methodOverride('_method'));
// initiate the basic route
app.get('/', (req, res) => {
    // render the home page from the view
    res.render('home');
});

// read all campground
// route for a list to show campground showing up
app.get('/campgrounds', async (req, res) => {
    const allCampgrounds = await Campground.find({});
    res.render('campgrounds/index', { allCampgrounds });
});

// page to add enter the new campground information -- GET
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// create new campground -- POST
app.post('/campgrounds', async (req, res) => {
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
});

// read the campground with specified id -- GET
app.get('/campgrounds/:id', async (req, res) => {
    const tarCampground = await Campground.findById(req.params.id);
    res.render('campgrounds/detail', { tarCampground });
});

// read the information of the campground to be edited -- GET
app.get('/campgrounds/:id/edit', async (req, res) => {
    const tarCampground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { tarCampground });
});

// edit campground -- PUT
app.put('/campgrounds/:id', async (req, res) => {
    // res.send('it worked!!!');
    const id = req.params.id;
    // const {id} = req.params
    const updatedCampground = await Campground.findByIdAndUpdate(id, {
        ...req.body.tarCampground,
    });
    res.redirect(`/campgrounds/${updatedCampground._id}`);
});

// define the port
app.listen(3000, () => {
    console.log('Serving on port 3000');
});
