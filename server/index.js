const http = require("http");
const fs = require("fs");
const debug = require("debug");

const SERVER_PORT = 8000;

const page404 = fs.readFileSync("./public/404.html");

const server = http.createServer((request, response) => {
  const { url } = request;
  debug.log("url: " + url);
  let filepath;
  if ( !url.includes(".") || url.includes(".html")) {
    filepath = "public/index.html";
  } else {
    if (fs.existsSync("./public" + url)) filepath = "./public" + url;
    else if (fs.existsSync("./static" + url)) filepath = "./static" + url;
    else if (fs.existsSync("./node_modules" + url))
      filepath = "./node_modules" + url;
    else {
      debug.log("error: Not found : " + url);
      response.write(page404);
      response.end();
      return;
    }

    if (filepath.endsWith(".js"))
      response.setHeader("Content-Type", "application/javascript");
  }

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
