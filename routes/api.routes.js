const config = require('config');
const auth = require('../middleware/auth.middleware');
const levelMinutes = require('../utils/levelMinutes.js');

//const User = require('../models/User');
//const T = require('../constants/text');

const { Router } = require('express');
const router = Router();

router.post(
  '/',
  auth,
  async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken || authToken.split(' ')[1] !== config.get('docdoc').authToken) {
      // TODO: логировать!
      res.status(401).json({ error: 'Invalid Authentication Credentials' });
      return;
    }

    // params = req.body.params[0]
    const { method, params, rpcId, rpcVer } = req.body;
    if (!method || !params) {
      // TODO: логировать!
      return res.end();
    }

    switch (method) {
      case 'book':
        let {
          clinicId,
          doctorId: did,
          name,
          phone,
          email,
          comment,
          time,
          status
        } = params[0];

        let [
          match, year, month, day, hours, minutes
        ] = time.match(/(\d\d\d\d)\D(\d\d)\D(\d\d)T(\d\d)\D(\d\d)/);

        const isMoreHalf = minutes > 30;

        if (!status) status = 'NEW';

        minutes = levelMinutes(Number(minutes));

        if (minutes === 0 && isMoreHalf) {
          hours = Number(hours) === 23 ? 0 : Number(hours) + 1;
          if (hours < 10) {
            hours = '0' + hours;
          }
        }

        if (minutes < 10) {
          minutes = '0' + minutes;
        }

        time = time.replace(/\d\d:\d\d/, `${hours}:${minutes}`);

        const bid = `${clinicId}@${did}@${time}`;

        /*MongoClient.connect(url, {useNewUrlParser: true}, function(err, client) {
          const db = client.db(dbName);
          const collection = db.collection('books' + year);

          (async () => {
            var results = await collection.find({bid: bid}).toArray();
            if (results.length == 0) {
              collection.insertOne({bid: bid, clinicId:clinicId, did:did, time:time, name:name, phone:phone, email:email, comment:comment, status:status}, function(err, result){
                res.end(JSON.stringify({
                  "jsonrpc": rpcVer,
                  "id": rpcId,
                  "result": {
                    "bookId": bid
                  }
                }, null, 4));
              });

              global.io.emit('book', {bid: bid, clinicId:clinicId, did:did, time:time, name:name, phone:phone, email:email, comment:comment, status:status});
            }
            else {
              // ERROR
              res.end(JSON.stringify({
                "jsonrpc": rpcVer,
                "id": rpcId,
                "error": {
                  "code": 32404,
                  "message": "Busy time",
                }
              }, null, 4));
            }
            client.close();
          })();
        });*/
      break;

      case 'updateBook':

      break;

      case 'getBookStatus':

      break;

      case 'cancelBook':

      break;

      case 'setBookStatus':

      break;
    }

    try {
      /*res.status(201).json({
        ok: true,
        status: 201,
        jwt: token,
      });*/
    } catch (error) {
      console.log(error);
      res.status(500).json({
        ok: false,
        status: 500,
        massage: T.SOMETHING_WRONG
      });
    }
  }
);

module.exports = router;
