 export async function userLogin(userDetails){
    const { email, password, role } = req.body;
    // finding the user whehter it exist or not
    const userX = await User.find({ email });
    if (!userX) {
        throw new customError('User not registered', 401);

    }
    if (password != userX.password) {
        throw new customError("Password didn't match", 401);
    }

    return tokenGen(userX);
}