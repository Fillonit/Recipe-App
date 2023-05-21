const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require("path");
const {
    errorHandler,
    requestLoggerMiddleware
} = require('./middleware/errorMiddleware');

const userRouter = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');


const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');
console.log(uploadDirectory);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/users', userRouter);
app.use('/api/recipes', recipeRouter);
app.use('/images', express.static(uploadDirectory));

app.use(errorHandler);
app.use(requestLoggerMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});