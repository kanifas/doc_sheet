const config = require('config');
const axios = require('axios');

const auth = require('../middleware/auth.middleware');

const Doctor = require('../models/Doctor');

const { SOMETHING_WRONG } = require('../constants/text');

const { Router } = require('express');
const router = Router();

const { api, authToken, clinicId } = config.get('docdoc');

router.post(
  '/add',
  auth,
  async (req, res) => {
    const { name, room } = req.body;
    const did = Date.now();
    const body = {
      id: 99,
      jsonrpc: '2.0',
      method: 'addResources',
      params: {
        resources: [{
          name,
          type: 'doctor',
          external_id: did,
          external_clinic_id: clinicId
        }]
      }
    };

    try {
      const response = await axios.post(
        api,
        { body },
        { headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }}
      );

      console.log(response);

      const doctor = new Doctor({ did, name, room, status: 1 });
      const { _id } = await doctor.save();

      return res.status(200);
    } catch (error) {
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
    const { id } = req.body;
    const body = {
      id: 99,
      jsonrpc: '2.0',
      method: 'deleteResources',
      params: {
        resourceIds: [`${clinicId}#${id}`],
        useExternal: true
      }
    };

    try {
      const response = await axios.post(
        api,
        { body },
        { headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }}
      );

      console.log(response);
      Doctor.updateOne({did: id}, {status: 0}, function(err, result){
        assert.equal(null, err);
        res.status(200);
      });
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
      const doctors = await Doctor.find({});
      res.json(doctors);
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
