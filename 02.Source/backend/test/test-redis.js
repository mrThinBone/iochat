var bluebird = require("bluebird");
var redis = require("redis");
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);
var client = redis.createClient();
    
client.on('connect', function() {
    console.log('connected');
    
    // save a key-val(string)
    /*client.setAsync(['key1', 'val1'])
        .then(res => {
            console.log(res);
            return client.getAsync('key1');
        })
        .then(res => {
            console.log(res);
            client.del('key');
        });*/
        
    // multi operations | multi()
    /*client.multi().set('key1', 'val1').get('key1').del('key1')
        .execAsync().then(res => {
            console.log(res);
        });
        
    // operations on SET | sadd, smember
    client.multi().sadd(['key2', '1', '2', '3']).sadd(['key2',  '2']).smembers('key2').del('key2')
        .execAsync().then(res => {
           console.log(res); 
        });*/
        
    // find keys | scan
    client.multi().set('key_1', 'val1').set('key_2', 'val2').set('hi','not same').scan('key_*').del('key_1').del('key_2').del('hi')
        .execAsync().then(res => {
            console.log(res);
        });
    
    /* save a set programmatically | (arr)
    var arr = [];
    arr.push('mkey');
    arr = arr.concat(['1', '2', '3']);
    client.multi().sadd(arr).smembers('mkey').del('mkey').execAsync()
        .then(res => {
            console.log(res);
        });*/
    
    // get multi values by given keys     
    /*client.multi().set('key_1', 'val1').set('key_2', 'val2').mget(['key_1', 'key_2', 'not_exist']).del('key_1').del('key_2')
        .execAsync().then(res => {
            console.log(res);
        });*/
});