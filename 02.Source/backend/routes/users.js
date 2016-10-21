var express = require('express');
var jwt = require('jsonwebtoken');
var Promise = require('promise');
var Users = require('../models/user');
var redisClient = require('../utils/redis-instance');
var ChatSession = require('../utils/chat-session');
var chatSession = new ChatSession(redisClient);
var router = express.Router();

function signUp(req, res, next) {
  if(!req.body.id || req.body.pwd) {
    res.status(400).json({});
    return;
  }

  Users.create({
    id: req.body.id,
    pwd: req.body.pwd
  })
    .then(doc => {
      res.json({
        success: true
      });
    })
    .catch(err => {
      next(err);
    });
}

function signIn(req, res, next) {
  Users.findOne({ id: req.body.id, pwd: req.body.pwd })
    .then(doc => {
      if(doc) {
        return _sign(doc);
      } else {
        return "";
      }
    })
    .then(token => {
      res.json({
        token: token
      });
    });
}

function generateUid(req, res, next) {
  var task = chatSession.createNew();

  task.then(sessionId => {
    res.json({
      id: sessionId
    });
  });
}

router.post('/register', signUp);
router.post('/login', signIn);
router.get('/uid', generateUid);

function _sign(payload) {
  return new Promise(function (resolve, reject) {
    var token = jwt.sign(payload, 'aes-256-ctr');
    resolve(token);
  });
}

function _verify(token) {
  return new Promise(function (resolve, reject) {
    jwt.verify(token, 'aes-256-ctr', function (err, decoded) {
      if(err)
        reject(err);
      else
        resolve(decoded);
    });
  });
}

module.exports = router;