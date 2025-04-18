import express from 'express';
import passport from 'passport';

import { forgotPassword, resetPasswordUsingOtp, signin, signout, signup, verifyMail, verifyMailAfterExpiration } from '../controllers/user.controller.js';
import { auntheticationMiddleware } from '../middlewares/auntheticationMiddleware.js';


const userRouter = express.Router();

userRouter.post('/signin', signin);
userRouter.post('/signup', signup);
userRouter.get('/signout', auntheticationMiddleware, signout);
userRouter.get('/verify', verifyMail);
userRouter.get('/verify-email', auntheticationMiddleware, verifyMailAfterExpiration);
userRouter.post('/forgot-password', forgotPassword);
userRouter.post('/reset-password-using-otp', resetPasswordUsingOtp);

userRouter.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
userRouter.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: 'user/api/v1/signin' }), (req, res) => {
    // Set the JWT token in a cookie
    res.cookie('token', req.user.token, { httpOnly: true});
    res.redirect('/api/v1/test');
});

export default userRouter;