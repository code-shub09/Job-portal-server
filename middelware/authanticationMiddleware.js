
const jwt = require('jsonwebtoken');
const Jobseeker = require('../model/job_seeker');
const User = require('../model/user');

const protect = async (req, res, next) => {
    console.log('head: ', req.header)
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            console.log('❌ No token found in headers or cookies');
            return res.status(401).json({ message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);


        const user = await User.findById(decoded.id).select('-password');
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        req.user = user;
        // console.log('user authenticated :',req.user);
        
        // passing to next middelware
        console.log('head: isne')
        next();
    }
    catch (error) {
        console.error('JWT Auth Error:', error.message);
        return res.status(401).json({ message: "Not authorized, token failed" });
    }
    // console.log('not---- athorised')zzxz
}




const authorize = (...roles) => {
    return function middelwareAuth0(req, res, next) {
        console.log('user  auth')
        if (!req.user) {
            console.log('user not auth')
            return res.status(401).json({ message: "User not authenticated" });
        }
        console.log('user  ---auth');
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    };

}

module.exports = {
    protect, authorize
};