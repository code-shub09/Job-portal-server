




// (...roles) :- it means roles varibale is dynamic it can take : It means: "accept any number of arguments and put them in an array".

// function test(...args) {
//     console.log(args);
//   }
  
//   test(1, 2, 3); 
  // Output: [1, 2, 3]
  
const authorize = (...roles) => {
    
    function middelwareAuth0(req, res, next) {
        if (!roles.includes(req.user.role)) {
            console.log('not athorised')
            return res.status(403).json({ message: "Forbidden: Access denied" });
        }
        console.log('athorised')
        next();
    };
    return middelwareAuth0(roles)
}