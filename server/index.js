const http = require("http");
const fs = require("fs");
const debug = require("debug");

const SERVER_PORT = 8001;

const page404 = fs.readFileSync("./public/404.html");

const server = http.createServer((request, response) => {
  const { url } = request;
  debug.log("url: " + url);
  const normUrl = !url.includes(".") ? "/index.html" : url;
  let filepath;
  if (fs.existsSync("./public" + normUrl)) filepath = "./public" + normUrl;
  else if (fs.existsSync("./static" + normUrl)) filepath = "./static" + normUrl;
  else if (fs.existsSync("./node_modules" + normUrl))
    filepath = "./node_modules" + normUrl;
  else {
    debug.log("error: Not found : " + normUrl);
    response.write(page404);
    response.end();
    return;
  }

  if (filepath.endsWith(".js"))
    response.setHeader("Content-Type", "application/javascript");
  debug.log("filepath: " + filepath);
  fs.readFile(filepath, (err, data) => {
    if (err) {
      debug.log("error: " + JSON.stringify(err));
      response.write(page404);
      response.end();
      return;
    }

    response.write(data);
    response.end();
  });
});

debug.log("Starting server...");
server.listen(SERVER_PORT);
