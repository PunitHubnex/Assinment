const Users = require("../models/users");
require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const RefreshToken = require('../models/refreshTokens');

const refreshTokenMaxage = 2 * 24 * 60 * 60 * 1000;
const accessTokenMaxage = 10 * 60 * 100;

const generateRefreshToken = async (user) => {
  const payload = {
    email: user.email,
    userId: user._id.toString(),
  };

  const secret = process.env.JWT_REFRESH_SECRET_KEY;

  const options = {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    algorithm: "HS256",
  };
  const refreshToken = jwt.sign(payload, secret, options);
  const tokenDoc = new RefreshToken({ userId: user._id, token: refreshToken });
  await tokenDoc.save();
  return refreshToken;
};

const generateAccessToken = async (user) => {
  const payload = {
    email: user.email,
    userId: user._id.toString(),
  };

  const secret = process.env.JWT_ACCESS_SECRET_KEY;

  const options = {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME,
    algorithm: "HS256",
  };
  const accessToken = jwt.sign(payload, secret, options);

  return accessToken;
};


exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error("Validation failed");
      error.statusCode = 400;
      error.data = errors.array();
      throw error;
    }

    const { fullName, email, password } = req.body;
    if (!fullName) {
      const error = new Error("Bad request");
      error.statusCode = 400;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = new Users({
      fullName: fullName,
      email: email,
      password: hashedPassword,
    });
    const savedUser = await user.save();
    if (!savedUser) {
      throw new Error("Something went wrong.");
    }

    res
      .status(201)
      .json({ message: "Signed Up successfully." });
  } catch (error) {
    next(error);
  }
};





exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!(email && password)) {
      const error = new Error("Bad request");
      error.statusCode = 400;
      throw error;
    }
    const userData = await Users.findOne({ email });
    if (!userData) {
      const error = new Error("Email does not exists.");
      error.statusCode = 404;
      throw error;
    }
    const passwordCompare = await bcrypt.compare(password, userData.password);
    if (!passwordCompare) {
      const error = new Error("Incorrect Password.");
      error.statusCode = 401;
      throw error;
    }


    const accessToken = await generateAccessToken(userData);
    const refreshToken = await generateRefreshToken(userData);
    res.cookie("refreshToken", refreshToken.toString(), {
      httpOnly: true,
      maxAge: refreshTokenMaxage,
    });


    console.log({
      message: "Success.",
      accessToken,
      accessTokenExpiresIn: accessTokenMaxage,
      refreshTokenExpiresIn: refreshTokenMaxage,
      userId: userData._id,
    });
    res.status(200).json({
      message: "Success.",
      accessToken,
      accessTokenExpiresIn: accessTokenMaxage,
      refreshTokenExpiresIn: refreshTokenMaxage,
      userId: userData._id,
    });
  } catch (error) {
    next(error);
  }
};



exports.refreshAccessToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const secret = process.env.JWT_REFRESH_SECRET_KEY;

    const options = {
      algorithms: ["HS256"],
    };
    const decoded = jwt.verify(refreshToken, secret, options);

    const tokenDoc = await RefreshToken.findOne({
      userId: decoded.userId,
      token: refreshToken,
    });

    if (tokenDoc.used) {
      const error = new Error("Refresh token has already been used");
      error.statusCode = 498;
      throw error;
    }

    const user = await Users.findById(decoded.userId);
    const newRefreshToken = await generateRefreshToken(user);

    tokenDoc.used = true;
    await tokenDoc.save();
    const newAccessToken = await generateAccessToken(user);

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      maxAge: refreshTokenMaxage,
    });

    res.status(200).json({
      message: 'Successfully created access token and refresh token',
      accessToken: newAccessToken,
      accessTokenExpiresIn: accessTokenMaxage,
      refreshTokenExpiresIn: refreshTokenMaxage,
      userId: user._id,
    });



  } catch (error) {
    next(error);
  }

};



exports.logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    const secret = process.env.JWT_REFRESH_SECRET_KEY;

    const options = {
      algorithms: ["HS256"],
    };
    const decoded = jwt.verify(refreshToken, secret, options);
    await RefreshToken.updateMany({ userId: decoded.userId }, { used: true });
    res.status(200).json({ message: 'Successfully logged out.' });
  } catch (error) {
    next(error);
  }

};
exports.userData = async (req, res, next) => {
  try {
    const { id } = req.params
    const data = await Users.findById(id)
    if (!data) {
      throw new Error('No user found')
    }
    res.status(200).json({
      error: false,
      message: "user data fetch successfully",
      data: data,
    })


  } catch (error) {
    next(error);
  }

};