import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

const secret = process.env.JWT_SECRET;
const tokenExpiration = '7d';

const COIN_BONUS = 10;
const STREAK_BONUS = 5;

const generateToken = (user) => {
  const token = jwt.sign(
    { email: user.email, id: user._id },
    secret,
    { expiresIn: tokenExpiration }
  );
  return token;
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

    // If it has been more than 2 days since the last streak claim, reset the streak count
    const { lastStreak } = existingUser;
    const streakExpiration = new Date(lastStreak);
    streakExpiration.setDate(streakExpiration.getDate() + 2);
    const now = new Date();
    if (now > streakExpiration) {
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

  // Can only claim once per day
  const { lastStreak } = currentUser;
  const streakExpiration = new Date(lastStreak);
  streakExpiration.setDate(streakExpiration.getDate() + 1);
  const now = new Date();
  if (now < streakExpiration) {
    return res.status(400).json({ message: 'You have already claimed your reward for today.' });
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

const calculateReward = (user) => {
  const reward = COIN_BONUS + (user.streakCount * STREAK_BONUS);
  return reward;
}