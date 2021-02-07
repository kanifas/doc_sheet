const { Router } = require('express');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const User = require('../models/User');

const T = require('../constants/text');

const router = Router();
const SALT_ROUNDS = 10;
const PASSWORD_MIN = 6;

/* /api/auth/signup */
router.post(
  '/signup',
  [
    check('email', T.INVALID_EMAIL).isEmail(),
    check('password', `Минимальная длина пароля ${PASSWORD_MIN} символов`).isLength({ min: PASSWORD_MIN }),
    check('firstName', T.NO_FIRST_NAME).exists(),
    check('lastName', T.NO_LAST_NAME).exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: T.INVALID_REGISTRATION_DATA,
          details: errors.array(),
        });
      }

      const { email, password, firstName, lastName } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(409).json({
          ok: false,
          status: 409,
          message: T.USER_ALREADY_EXISTS,
        });
      }

      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const user = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      const { _id } = await user.save();

      const isRoot = config.get('roots').some(rootEmail => rootEmail === email);

      const token = jwt.sign(
        { id: _id, firstName, lastName, email, isRoot }, /* Что токенизировать */
        config.get('jwtSecret'),
        { expiresIn: '24h' },
      );

      res.status(201).json({
        ok: true,
        status: 201,
        jwt: token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: T.SOMETHING_WRONG
      });
    }
  });

router.post(
  '/signin',
  [
    check('email', T.INVALID_EMAIL).isEmail(),
    check('password', T.NO_PASSWORD).exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          details: errors.array(),
          message: T.INVALID_AUTHORIZATION_DATA,
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: T.NO_SUCH_USER
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          ok: false,
          status: 401,
          message: `${T.INVALID_PASSWORD}. ${T.TRY_AGAIN}`,
        });
      }

      const isRoot = config.get('roots').some(rootEmail => rootEmail === email);

      const { id, firstName, lastName } = user;
      const token = jwt.sign(
        { id, firstName, lastName, email, isRoot }, /* Что токенизировать */
        config.get('jwtSecret'),
        { expiresIn: '24h' },
      );

      res.json({
        ok: true,
        status: 200,
        jwt: token,
      });
    } catch (err) {
      //console.log(err);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: T.SOMETHING_WRONG,
      });
    }
  });

module.exports = router;
