"use strict";
const http_1 = require("http");
const CRLF = '\r\n';
class Response {
    constructor(socket, options = {}) {
        this.statusCode = 200;
        this.headers = {};
        this.socket = socket;
        this.options = options;
    }
    get statusMessage() {
        const fromOptions = (this.options.statusMessages || {})[this.statusCode];
        const fromHttp = http_1.STATUS_CODES[this.statusCode];
        return fromOptions || fromHttp;
    }
    get body() {
        return this._bodyStringified ? JSON.parse(this._bodyStringified) : undefined;
    }
    set body(body) {
        this._bodyStringified = JSON.stringify(body);
        this.headers['Content-Length'] = this._bodyStringified.length;
    }
    send() {
        const protocol = this.options.protocol || 'HTTP/1.1';
        let buffer = `${protocol} ${this.statusCode} ${this.statusMessage}${CRLF}`;
        Object.keys(this.headers).forEach(field => {
            buffer += field + ':' + this.headers[field] + CRLF;
        });
        buffer += CRLF;
        if (this.body) {
            buffer += this.body;
        }
        this.socket.write(buffer);
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map