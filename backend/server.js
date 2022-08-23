import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import userRouter from './routes/userRoutes.js';
const app = express();
dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('connected to db');
  })
  .catch((err) => {
    console.log(err.message);
  });

let corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

const PORT = process.env.PORT || 5000;
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', function (req, res) {
  res.json({ message: 'Hello World' });
});
app.use('/api/users', userRouter);
// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/index.html'))
// );

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
