


// basically responsehandler ek normal function ko try and catch mai wrap kr ke return kr dega takki baar baar naa karne pade
function responseHandler(fun) {
  async function asyncHandler(req, res) {
    try {
        console.log('fun-------')
      await fun(req, res);
    } catch (error) {
        console.log('wrong-------',error)
      if (error.name === "ValidationError") {
        error.statusCode = 400;
      }

      res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || "Internal Server Error",
      });
    }
  }
  return asyncHandler;
}

module.exports = responseHandler;
