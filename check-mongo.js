const net = require('net');

const client = new net.Socket();

client.connect(27017, '127.0.0.1', function () {
    console.log('MongoDB is running on port 27017');
    client.destroy();
});

client.on('error', function (err) {
    console.log('MongoDB is not running on port 27017');
    console.log('Error:', err.message);
}); 