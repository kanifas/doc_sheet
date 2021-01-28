const { Router } = require('express');
const bcrypt = require('bcrypt');
const config = require('config');
const jwt = require('jsonwebtoken');

const { check, validationResult } = require('express-validator');

const User = require('../models/User');

const router = Router();
const saltRounds = 10;

const PASSWORD_MIN = 6;

/* /api/auth/signup */
router.post(
  '/signup',

  [/* middle wares */
    check('email', 'Некорректный Email').isEmail(),
    check('password', `Минимальная длина пароля ${PASSWORD_MIN} символов`).isLength({ min: PASSWORD_MIN }),
    check('firstName', 'Не указано имя').exists(),
    check('lastName', 'Не указана фамилия').exists(),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          message: 'Некорректные данные для регистрации',
          errors: errors.array(),
        });
      }

      const { email, password, firstName, lastName } = req.body;
      const candidate = await User.findOne({ email });

      if (candidate) {
        return res.status(409).json({
          ok: false,
          status: 409,
          message: 'Такой пользователь уже зарегистрирован',
        });
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = new User({
        email,
        firstName,
        lastName,
        password: hashedPassword,
      });

      await user.save();

      res.status(201).json({
        ok: true,
        status: 201,
        message: `Пользователь (${email}) успешно зарегистрирован`,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: 'Что-то пошло не так...'
      });
    }
  });

router.post(
  '/signin',

  [/* middle wares */
    check('email', 'Некорректный Email')/*.normalizeEmail()*/.isEmail(),
    check('password', 'Не указан пароль').exists(),
  ],

  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          ok: false,
          status: 400,
          errors: errors.array(),
          message: 'Некорректные данные для авторизации',
        });
      }

      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({
          ok: false,
          status: 404,
          message: 'Такого пользователя нет'
        });
      }

      const match = await bcrypt.compare(password, user.password);

      if (!match) {
        return res.status(401).json({
          ok: false,
          status: 401,
          message: 'Пароль не совпадает. Попробуйте еще раз',
        });
      }

      const token = jwt.sign(
        { id : user.id }, /* Что токенизировать */
        config.get('jwtSecret'),
        { expiresIn: '1h' },
      );

      res.json({
        token,
        ok: true,
        status: 200,
        id: user.id,
      });
    } catch (err) {
      //console.log(err);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: 'Что-то пошло не так...',
      });
    }
  });

module.exports = router;
