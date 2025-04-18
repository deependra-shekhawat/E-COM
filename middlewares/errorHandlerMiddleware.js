export const errorHandlerMiddleware = (err, req, res, next) => {
    console.error("in Error Middleware: "+err.stack);

    //const MongooseError  = err.split(":")[0];
    console.log("Error Name: "+ err.name);

    if(err.name === 'ValidationError'){
        const errors = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({error: errors});
    }
    else if(err.name === 'CastError'){
        return res.status(400).json({error: err.message});
    }
    else if(err.name === 'MongooseError'){
        return res.status(400).json({error: err.message});
    }

    res.status(err.statusCode || 500).json({error: err.message || 'Something went wrong please try again later' });
}