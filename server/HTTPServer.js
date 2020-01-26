class HTTPServer {
  constructor() {
    this.server = null;
  }
  setServer(server) {
    if (this.server) {
      console.log("HTTP server error, a server is already assigned.");
    } else {
      this.server = server;
    }
  }

  getServer() {
    return this.server;
  }
}

export default new HTTPServer();
