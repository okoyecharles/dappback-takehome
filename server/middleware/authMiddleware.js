import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

const protect = async (req, res, next) => {
  // Get token from request header
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Not authorized. No token' });
  }

  try {
    // Validate token
    const decoded = jwt.verify(token, secret);
    // Attach user to request object
    req.user = decoded;
    next();
  }
  catch (error) {
    return res.status(401).json({ message: 'Not authorized.' });
  }
}

export default protect;