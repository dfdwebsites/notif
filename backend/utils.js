import jwt from 'jsonwebtoken';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d'
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); //Bearer XXXXXXX
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid Token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const formatTime = (time) => {
  let timeAr = time.split(':');
  let hours = timeAr[0];
  let min = timeAr[1];
  let pmam = '';
  if (hours >= 12) {
    if (hours == 12) {
      pmam = 'PM';
    } else {
      hours -= 12;
      pmam = 'PM';
    }
  } else {
    pmam = 'AM';
  }
  return `${hours}:${min} ${pmam}`;
};
