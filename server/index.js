const http = require('http');
const fs = require('fs');
const debug = require('debug');

const SERVER_PORT_PROD = 80;
const SERVER_PORT_DEV = 8000;


const page404 = fs.readFileSync('./public/404.html');

const server = http.createServer((request, response) => {
    const {url} = request;
    debug.log('url: ' + url);
    let filepath;
    if ( !url.includes('.') || url.includes('.html')) {
        if ( url.startsWith('/csat/'))
            filepath = 'dist/csat/index.html'
        else
            filepath = 'dist/index.html';
    } else {
        if (fs.existsSync('./dist' + url)) {
            filepath = './dist' + url;
        } else {
            debug.log('error: Not found : ' + url);
            response.write(page404);
            response.end();
            return;
        }
    }

    if (filepath.endsWith('.js')) {
        response.setHeader('Content-Type', 'application/javascript');
    }
    
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
    });
});

debug.log('Starting server...');


if (process.env.NODE_ENV === "prod") {
    server.listen(SERVER_PORT_PROD);
} else{
    server.listen(SERVER_PORT_DEV);
}
