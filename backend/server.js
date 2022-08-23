const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const app = express();

dotenv.config();

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

// const __dirname = path.resolve();
// app.use(express.static(path.join(__dirname, '/frontend/')));
// app.get('*', (req, res) =>
//   res.sendFile(path.join(__dirname, '/frontend/index.html'))
// );

app.listen(PORT, () => {
  console.log(`server running at ${PORT}`);
});
