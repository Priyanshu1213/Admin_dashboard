const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://priyanshuyadav39976:pn126@cluster0.fh2bk.mongodb.net/';


mongoose.connect(mongoURI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
});
module.exports=mongoose
