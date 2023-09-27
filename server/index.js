const http = require('http');
const fs = require('fs');
const debug = require('debug');

const SERVER_PORT = 8000;

const page404 = fs.readFileSync('./public/404.html');

const server = http.createServer((request, response) => {
    const {url} = request;
    debug.log('url: ' + url);
    const normalizedUrl = url === '/' ? '/index.html' : url;
    const filepath = normalizedUrl.startsWith("/static") ? `.${normalizedUrl}` : `./public${normalizedUrl}`;
    debug.log('filepath: ' + filepath);

    fs.readFile(filepath, (err, data) => {
        if (err) {
            debug.log('error: ' + JSON.stringify(err));
            response.write(page404);
            response.end();
            return;
        }

        response.write(data);
        response.end();
    })
});

debug.log('Starting server...');
server.listen(SERVER_PORT);