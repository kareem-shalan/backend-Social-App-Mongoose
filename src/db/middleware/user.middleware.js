import jwt from 'jsonwebtoken';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token missing" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;
    console.log(req.user , "req.user");
   
    res.UserName=req.user.email.split('@')[0]
    res.userId=req.user.userId
    next();
  } catch (err) {
    res.status(403).json({ msg: "Invalid token" });
  }
};
export default authenticate