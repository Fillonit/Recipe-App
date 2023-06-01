const express = require('express');
const dotenv = require('dotenv').config();
const port = process.env.PORT || 5000;
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require("path");
const {
    errorHandler,
    requestLoggerMiddleware
} = require('./middleware/errorMiddleware');
const TOKEN_KEY = process.env.TOKEN_KEY;

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
const chefApplicationRouter = require('./routes/chefApplicationRoutes');
const initRecipesRouter = require('./routes/initRecipesRoutes');

const app = express();
const uploadDirectory = path.join(__dirname, 'uploads');
const chefApplicationsDirectory = path.join(uploadDirectory, 'chefApplications');
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
app.use('/api/chefApplications', chefApplicationRouter);
app.use('/api/initRecipes', initRecipesRouter);

app.use('/images', express.static(uploadDirectory));
app.use('/images/chefApplications', (req, res, next) => {
    const token = req.query.token;
    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired" });
            return;
        }
        if (decoded.role != 'admin') {
            res.status(403).json({ message: "You do not have permission to get this resource." });
            return;
        }
        isValid = true;
        userId = decoded.userId
    })
    if (!isValid) return;
    next();
}, express.static(chefApplicationsDirectory));

app.get('/testResponse', (req, res) => {
    let path = req.url;
    responses.resourceAdded(res, `${path ?? 'Test'}`);
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});