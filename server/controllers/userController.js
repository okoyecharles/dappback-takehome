import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import moment from 'moment/moment.js';

const secret = process.env.JWT_SECRET;
const tokenExpiration = '7d';

const generateToken = (user) => {
  const token = jwt.sign(
    { email: user.email, id: user._id },
    secret,
    { expiresIn: tokenExpiration }
  );
  return token;
}

const COIN_BONUS = 10;
const STREAK_BONUS = 5;
const calculateReward = (user) => {
  const reward = COIN_BONUS + (user.streakCount * STREAK_BONUS);
  return reward;
}

/*
 * @route   POST /users/signup
 * @desc    Register a new user
 * @access  Public
 */
export const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const result = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(result);

    res.status(201).json({ user: result, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

/*
  * @route   POST /users/login
  * @desc    Login a user
  * @access  Public
  */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: 'User does not exist' });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    };
    
    // using moment.js, a users streak will be reset if now is greater than a day after their last streak
    const now = moment();
    const lastStreak = moment(existingUser.lastStreak);
    const lastStreakNextDay = lastStreak.add(1, 'days');
    
    if (now.isAfter(lastStreakNextDay, 'day')) {
      existingUser.streakCount = 0;
    }
    
    const token = generateToken(existingUser);
    res
      .status(200)
      .json({ user: existingUser, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}

/*
  * @route   POST /users/claim
  * @desc    Claims coins reward for a user
  * @access  Private
  */
export const claimCoins = async (req, res) => {
  const { user } = req;
  const currentUser = await User.findById(user.id);

  if (!currentUser) {
    return res.status(404).json({ message: 'User does not exist' });
  }

  const now = moment();
  const lastStreak = moment(currentUser.lastStreak);
  if (now.isSame(lastStreak, 'day')) {
    return res.status(400).json({ message: 'You have already claimed your coins for today.' });
  }

  try {
    const reward = calculateReward(currentUser);
    currentUser.coins += reward;
    currentUser.streakCount += 1;
    currentUser.lastStreak = Date.now();
    await currentUser.save();

    res.status(200).json({ user: currentUser, reward });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong.' });
  }
}