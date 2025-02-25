// middleware/authenticateToken.js
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
  
    debugger
    if (token == null) return res.status(401).json({ message: 'Unauthorized' });
  
    // Verify token (assuming JWT)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: 'Forbidden' });
      req.user = user;
      next();
    });
  }
  
  module.exports = authenticateToken;
  