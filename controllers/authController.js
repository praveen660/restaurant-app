const { users } = require("../models");
const catchAsync = require("../Utils/catchAsync.js");
const AppError = require("../Utils/AppError");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
// user = models.users;

//SignUp
exports.createUser = catchAsync(async (req, res, next) => {
  let { email, password, role, name, ...rest } = req.body;
  if (!email || !password) {
    return next(new AppError("Email or Password can't be empty!", 400));
  }
  const userData = await users.findOne({ where: { email: email } });
  if (userData) {
    return next(new AppError("Email is already in use!", 409));
  }
  const data = { email, role: role, name: name };
  const hashPassword = await bcrypt.hash(password, 12);
  data.password = hashPassword;

  const newUser = await users.create(data);
  res.status(201).send({ message: "success", data: newUser });
});

// Login
exports.userLogin = catchAsync(async (req, res, next) => {
  let { email, password, ...rest } = req.body;

  if (!email || !password) {
    return next(new AppError("Email or Password can't be empty!", 400));
  }
  const newUser = await users.findOne({ where: { email: email } });
  if (!newUser || !(await bcrypt.compare(password, newUser.password))) {
    return next(new AppError("Incorrect Email or Password!", 401));
  }
  const token = jwt.sign(
    { id: newUser.id, username: newUser.email, role: newUser.role },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.EXPIRES_IN,
    }
  );
  res
    .status(200)
    .send({ message: "successfully logged In", data: newUser, token: token });
});

//Protect
exports.protect = catchAsync(async (req, res, next) => {
  let token;
  //1.) getting token & check if it's there
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }

  //2.) Verification Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  // console.log(decoded);

  //3.) check if user still exist
  const currentUser = await users.findOne({ where: { id: decoded.id } });
  if (!currentUser) {
    return next(
      new AppError("The user does not exits belonging to this token", 401)
    );
  }

  //GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});

//restricted route
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError("You do no have permission to perform this action", 403)
      );
    }
    next();
  };
};
