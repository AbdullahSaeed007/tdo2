const sendToken = (user, statusCode, res) => {
  //create jwt token
  const token = user.getJwtToken();
  //take token from user and store it into the cookie
  //options for cookie
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
  };

  res.status(statusCode).cookie("token", token, options).json({
    sucess: true,
    message: "succesfully created",
    token,
    user,
  });
};
module.exports = sendToken;
