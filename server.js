//Imports
const express = require("express");
const connectDB = require('./config/db');

//Initializations
const app = express();
const PORT = process.env.PORT || 5000;

//Connection to database
connectDB();

//Initialize Middleware
app.use(express.json({ extended: false }));

//Endpoints
app.get('/', (req, res) => {
    res.send('Hello devs');
})

app.use('/api/users', require('./routes/api/users'));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));
app.use('/api/profile', require('./routes/api/profile'));

//App listening
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));