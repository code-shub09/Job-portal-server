
const jwt = require('jsonwebtoken');
const Jobseeker = require('../model/job_seeker');
const User = require('../model/user');


const protect = async (req, res, next) => {

    if (req.headers.authorization && req.headers.authorization.startwith('Bearer')) {
        try {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env);


            const user = await User.find({ id: decoded.id }).select('-password');
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }

            req.user = user;
            // passing to next middelware
            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: "Not authorized, token failed" });

        }
    }


}




const authorize = (...roles) => {
    function middelwareAuth0(req, res, next) {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        next();
    };
    return middelwareAuth0(roles)
}

module.exports.protect = protect;