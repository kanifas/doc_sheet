const config = require('config');
const { Router } = require('express');
const { nanoid } = require('nanoid');
const Link = require('../models/Link');
const auth = require('../middleware/auth.middleware');

const router = Router();

router.post(
  '/gen',
  auth,
  async (req, res) => {
    try {
      const baseUrl = config.get('baseUrl');

      const { from } = req.body;
      const { id: owner } = req.user;

      const code = nanoid();
      const existingLink = await Link.findOne({ from });

      if (existingLink) {
        return res.json({ link: existingLink });
      }

      const to = `${baseUrl}/to/${code}`;
      const link = new Link({ code, to, from, owner });

      await link.save();

      return res.status(201).json({ link });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        ok: false, status: 500, massage: 'Что-то пошло не так...'
      });
    }
  });

router.get(
  '/',
  auth,
  async (req, res) => {
    try {
      const links = await Link.find({ owner: req.user.id });
      res.json(links);
    } catch (err) {
      res.status(500).json({
        ok: false, status: 500, massage: 'Что-то пошло не так...'
      });
    }
  });

router.get(
  '/:id',
  auth,
  async (req, res) => {
    try {
      const link = await Link.findById(req.params.id);
      res.json(link);
    } catch (err) {
      res.status(500).json({
        ok: false, status: 500, massage: 'Что-то пошло не так...'
      });
    }
  });

module.exports = router;
