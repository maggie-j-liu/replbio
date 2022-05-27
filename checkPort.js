import net from 'net';
const server = net.createServer();

server.once('error', function(err) {
  if (err.code === 'EADDRINUSE') {
    console.log("Port 3000 is in use. Are you running a dev build?")
    process.exit(1)
  }
});

server.once('listening', function() {
  server.close();
  process.exit(0);
});

server.listen(3000);
