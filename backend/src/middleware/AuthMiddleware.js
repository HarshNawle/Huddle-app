import jwt from "jsonwebtoken";


const verifyToken =  (req, res, next) => {
    const token = req.cookies.jwt;
    if(!token) return res.status(401).send("Your are not authenticated");
    jwt.verify(token, 
      process.env.JWT_SECRET_KEY ,  
      (err, payload) => {
        if(err) return res.status(403).send("Token is not valid");
        const decode = payload;
        req.userId = decode.userId;
        next();
    })
} 
export default verifyToken;