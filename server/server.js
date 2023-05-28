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

const responses = require('./responses');

const userRouter = require('./routes/userRoutes');
const recipeRouter = require('./routes/recipeRoutes');
const cuisineRouter = require('./routes/cuisineRoutes');
const unitRouter = require('./routes/unitRoutes');
const tagRouter = require('./routes/tagRoutes');
const ingredientRouter = require('./routes/ingredientRoutes');
const contactRouter = require('./routes/contactRoutes');
const adminRouter = require('./routes/adminRoutes');
const commentRouter = require('./routes/commentRoutes');

const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requestLoggerMiddleware);

app.use('/api/user', userRouter);
app.use('/api/recipe', recipeRouter);
app.use('/api/cuisines', cuisineRouter);
app.use('/api/units', unitRouter);
app.use('/api/tags', tagRouter);
app.use('/api/ingredients', ingredientRouter);
app.use('/api/admin', adminRouter);
app.use('/api/contacts', contactRouter);
app.use('/api/comments', commentRouter);

app.use('/images', express.static(uploadDirectory));

app.get('/testResponse', (req, res) => {
    let path = req.url;
    responses.resourceAdded(res, `${path ?? 'Test'}`);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});