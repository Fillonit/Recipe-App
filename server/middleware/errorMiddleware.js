const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

const requestLoggerMiddleware = (req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
};


module.exports = {
    errorHandler,
    requestLoggerMiddleware
};