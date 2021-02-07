const { Router } = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth.middleware');

const { SOMETHING_WRONG } = require('../constants/text');

const router = Router();

router.post(
  '/add',
  auth,
  async (req, res) => {
    // TODO: if !root return warn (заюзать мидлварину) + криптануть пароль
    try {
      const { firstName, lastName, email, password, isRoot } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.json({ 'error': `Пользоватеь (${email}) уже существует`});
      }

      // TODO: crypt password
      const user = new User({ firstName, lastName, email, password, isRoot });

      await user.save();

      return res.status(200);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: SOMETHING_WRONG
      });
    }
  }
);

router.post(
  '/remove',
  auth,
  async (req, res) => {
    try {
      const { email } = req.body;

      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        return res.status(404).json({ error: 'Такого пользователя нет' });
      }

      await User.deleteOne({ email });
      res.status(200);
    } catch (err) {
      res.status(500).json({
        ok: false,
        status: 500,
        massage: SOMETHING_WRONG
      });
    }
  }
);

router.post(
  '/get',
  auth,
  async (req, res) => {
    try {
      const users = await User.find({});
      res.json(users);
    } catch (err) {
      res.status(500).json({
        ok: false,
        status: 500,
        massage: SOMETHING_WRONG
      });
    }
  }
);

module.exports = router;
