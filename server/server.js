const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');


const {
    errorHandler,
    requestLoggerMiddleware
} = require('./middleware/errorMiddleware');

const userRouter = require('./routes/userRoutes');


const app = express();


app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

app.use('/api/users', userRouter);

app.use(errorHandler);
app.use(requestLoggerMiddleware);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});