const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
}

// const requestLoggerMiddleware = (req, res, next) => {
//     console.log(`| \x1b[32mMETHOD:\x1b[0m ${req.method} | \x1b[32mPATH:\x1b[0m ${req.url} | \x1b[32mTIME:\x1b[0m ${new Date().toLocaleString()} | \x1b[32mTOKEN:\x1b[0m ${JSON.stringify(req.headers['r-a-token']) ?? 'No'} |`);
//     next();
// };


const requestLoggerMiddleware = (req, res, next) => {
    if(process.env.NODE_ENV === 'production') return next();
    const method = `\x1b[32mMETHOD:\x1b[0m ${req.method}`;
    const path = `\x1b[32mPATH:\x1b[0m ${req.url}`;
    const time = `\x1b[32mTIME:\x1b[0m ${new Date().toLocaleString()}`;
    const token = `\x1b[32mTOKEN:\x1b[0m ${JSON.stringify(req.headers['r-a-token']) ?? 'No'}`;
    const protocol = `\x1b[32mPROTOCOL:\x1b[0m ${req.protocol}`;

    const tableRow = `| ${method} | ${path} | ${time} | ${token} |`;

    const tableLine = '-'.repeat(tableRow.length - 36);

    console.log(tableLine);
    console.log(tableRow);
    console.log(tableLine);

    next();
};


module.exports = {
    errorHandler,
    requestLoggerMiddleware
};