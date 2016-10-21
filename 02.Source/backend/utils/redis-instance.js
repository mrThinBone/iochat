/**
 * Created by DELL-INSPIRON on 10/20/2016.
 */
 'use strict';
var bluebird = require("bluebird");
var redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();

client.on('connect', function() {
  console.log('connected');
  /*client.multi().del('uuids').keys('ssi_*').keys('cli_*').execAsync()
    .then(res => {
       //console.log(res);
       let ssi = res[1];
       let cli = res[2];
       for(let k in ssi) {
           //console.log(ssi[k] + " | " + cli[k]);
           client.del(ssi[k]);
           client.del(cli[k]);
       }
    });*/
    client.flushdb( function (err, succeeded) {console.log(succeeded);});  // will be true if successfull
});

module.exports = client;