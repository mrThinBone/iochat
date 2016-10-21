/**
 * Created by DELL-INSPIRON on 10/10/2016.
 */
'use strict';
 
var Promise = require('promise');
var Chance = require('chance');
var chance = new Chance();
var ChatSessions = function (redisClient) {
  console.log('ChatSessions initialization.');
  this.redisClient = redisClient;
  return this;
};

var sessionIdPrefix = "ssi_";
var clientIdPrefix = "cli_";

ChatSessions.prototype.onlineUsers = function () {
  return this.redisClient.smembersAsync('uuids');
};

ChatSessions.prototype.createNew = function () {
  return this.redisClient.smembersAsync('uuids')
    .then(uuids => {
      return new Promise(function (resolve, reject) {
        let _uuids = new Set(uuids);
        let id = chance.name();
        while (_uuids.has(id)) {
          id = chance.name();
        }
        resolve(id);
      });
    });
};

ChatSessions.prototype.store = function (uid, socketId) {
  let sessions = ['uuids', uid];
  return this.redisClient.saddAsync(sessions)
    .then(count => {
      if(count > 0) {
        return this.redisClient.multi().set(sessionIdPrefix + socketId, uid).set(clientIdPrefix + uid, socketId).execAsync();
      } else {
        return null;
      }
    })
    .then(result => {
      return new Promise(function (resolve, reject) {
        if(!result) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
};

ChatSessions.prototype.revoke = function (socketId) {
  let _uid;
  return this.redisClient.getAsync(sessionIdPrefix + socketId)
    .then(uid => {
      if(!uid) return null; // user has duplicated id & could not be store in store(), then force to disconnect by server
      
      _uid = uid;
      return this.redisClient.multi().srem(['uuids', uid]).del(sessionIdPrefix+socketId).del(clientIdPrefix+uid).execAsync();
    })
    .then(result => {
      return new Promise(function (resolve, reject) {
        resolve(_uid);
      });
    })
    .catch(err => {
      console.log(err);
    });
};

ChatSessions.prototype.findSocketId = function (uid) {
  return this.redisClient.getAsync(clientIdPrefix + uid);
};

module.exports = ChatSessions;