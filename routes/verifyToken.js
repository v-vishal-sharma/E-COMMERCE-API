const jwt = require("jsonwebtoken");

const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token;
    if (authHeader) {
        const token = authHeader;
        jwt.verify(token, process.env.JWT_SEC, (err,user) => {
            if(err) res.status(403).json("Token invalid!");
            // user here stores the user id and whether the user is admin or not.
            req.user = user;
            next();
        });
    }else{
        return res.status(401).json("Authentication failure!!");
    }
};

const verifyTokenAndAuthorization = (req,res,next) => {
    verifyToken(req,res,()=>{
        // params.id will fetch id from our request i.e. from the url.
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Invalid Access!!");
        }
    });
};

const verifyTokenAndAdmin = (req,res,next) => {
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next();
        }else{
            res.status(403).json("Invalid Access!!");
        }
    });
};

module.exports = {verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin};