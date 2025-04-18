// import express from 'express';
// import testModel from './models/test.model.js';
// import connectDB from './config/db.config.js';
// import dotenv from 'dotenv';

// dotenv.config();
// const app = express()

// connectDB();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get('/', (req, res)=>{
//   res.send("Hello");
// })

// app.post('/add', async (req, res)=>{
//     // let resultArray = await testModel.findOne({ name: 'deependra'});

//     // if(!resultArray){
//     //   resultArray = await testModel.create({tes: []});
//     // }

//     // console.log("result Array: " + resultArray);
//     // console.log("\nreq.body.strings:" +req.body.strings);

//     // const bodyArray = req.body.strings;
//     // for(let i=0; i<bodyArray.length; i++){
//     //   resultArray.test.push(bodyArray[i]);
//     // }

//     // resultArray.save();

//     // res.status(200).json(resultArray);
//     let resultArray = await testModel.create({ test: req.body.strings});

//     const result = await testModel.find();

//     let finalResult = [];

//     result.forEach( (output) => {
      
//     });

// });

// app.listen(3000, ()=>{
//   console.log("Server in running on 3000 port");
// });
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import session from 'express-session';

import connectDB from './config/db.config.js';
import userRouter from './routes/user.route.js';
import { errorHandlerMiddleware } from './middlewares/errorHandlerMiddleware.js';
import { morganMiddleware } from './middlewares/loggerMiddleware.js';
import { auntheticationMiddleware } from './middlewares/auntheticationMiddleware.js';
import passportGoogleMiddleware from './middlewares/passportGoogleMiddleware.js';
import productRouter from './routes/product.route.js';

const app = express();

dotenv.config();

connectDB();

// initialize express session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  //cookie: { secure: false }
}));

// initialize passport middleware
app.use(passport.initialize());
// use passport session with express session
app.use(passport.session());

// initialize passport google middleware
passportGoogleMiddleware();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.use(morganMiddleware);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`API start with <a href="http://localhost:${PORT}/api/v1/">http://localhost:${PORT}/api/v1/</a>`);
});

app.use('/api/v1/user', userRouter);
app.use('/api/v1/product', productRouter);
app.get('/api/v1/test', auntheticationMiddleware, (req, res) => {
  res.json({"message": "Hello World"});
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});