


// basically responsehandler ek normal function ko try and catch mai wrap kr ke return kr dega takki baar baar naa karne pade
export function responseHandler(fun){

    function asyncHandler(req,res){
        try {

            fun(req,res);
            
        } catch (error) {
            if(error.name=='ValidationError'){
                error.statusCode=400;
            }
            res.status(error.statusCode || 500
            ).json({
                success: false,
                message: error.message
            })

            
        }

    }

    return asyncHandler;

}