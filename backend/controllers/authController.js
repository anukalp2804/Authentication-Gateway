const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 465,
  secure: true, 
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, 
  },
});

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 60 * 60 * 1000), 
    httpOnly: true, 
    secure: process.env.NODE_ENV === 'production', 
    sameSite: 'lax',
  };

  res.status(statusCode).cookie('token', token, cookieOptions).json({
    success: true,
    user: { 
      id: user._id, 
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    },
  });
};

// 🛠️ REGISTER CONTROLLER
exports.register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user && user.isVerified) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = Date.now() + 10 * 60 * 1000; 

    if (user && !user.isVerified) {
      user.firstName = firstName;
      user.lastName = lastName;
      user.password = password;
      user.otp = otp;
      user.otpExpires = otpExpires;
    } else {
      user = new User({ firstName, lastName, email, password, otp, otpExpires });
    }

    await user.save();

    transporter.sendMail({
      from: `"Secure Auth App" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Verify Your Account - OTP Code',
      text: `Your OTP is ${otp}. It will expire in 10 minutes.`,
    }).catch(err => console.error("REGISTRATION MAIL ERROR:", err.message));

    res.status(201).json({ success: true, message: 'OTP sent to email successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛠️ VERIFY OTP CONTROLLER
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛠️ LOGIN CONTROLLER
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email credentials or password.' });
    }
    
    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: 'Account not verified.' });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 🛠️ RECONFIGURED CORS-SAFE LOGOUT CONTROLLER
exports.logout = (req, res) => {
  res.cookie('token', 'none', { 
    expires: new Date(Date.now() + 1000), 
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  // ✅ MUST return a JSON response payload, NOT res.redirect()
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
};

// 🛠️ FORGOT PASSWORD CONTROLLER
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: 'User does not exist.' });
    
    const resetOtp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = resetOtp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; 
    await user.save();
    
    transporter.sendMail({ 
      from: `"Secure Auth App" <${process.env.EMAIL_USER}>`, 
      to: user.email, 
      subject: 'Password Reset Request - OTP Code', 
      text: `You requested a password reset. Your OTP is ${resetOtp}. It will expire in 10 minutes.` 
    }).catch(mailError => console.error("BACKGROUND PASSWORD RECOVERY MAIL ERR:", mailError.message));
    
    return res.status(200).json({ success: true, message: 'Reset OTP sent.' });
  } catch (error) { 
    return res.status(500).json({ success: false, message: error.message }); 
  }
};

// 🛠️ RESET PASSWORD CONTROLLER
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP.' });
    }
    
    user.password = newPassword;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();
    
    res.status(200).json({ success: true, message: 'Password updated successfully!' });
  } catch (error) { 
    res.status(500).json({ success: false, message: error.message }); 
  }
};

// 🛠️ GET ME SESSION CONTROLLER
exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(200).json({ success: false, user: null });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(200).json({ success: false, user: null });
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });
  } catch (error) { 
    res.status(200).json({ success: false, user: null }); 
  }
};