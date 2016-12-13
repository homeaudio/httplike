"use strict";
const http_1 = require("http");
const CRLF = '\r\n';
class Response {
    constructor(socket, options) {
        this.statusCode = 200;
        this.headers = {};
        this.socket = socket;
        this.options = options || {};
        this.headers = {};
    }
    _statusMessage(statusCode) {
        const fromOptions = (this.options.statusMessages || {})[statusCode];
        const fromHttp = http_1.STATUS_CODES[statusCode];
        return (fromOptions || fromHttp);
    }
    status(statusCode) {
        this.statusCode = statusCode;
        return this;
    }
    get(field) {
        return this.headers[field];
    }
    set(field, value) {
        this.header(field, value);
    }
    header(field, value) {
        this.headers[field] = value;
    }
    send(status, body) {
        const protocol = this.options.protocol || 'HTTP/1.1';
        body = (typeof status === 'string' || typeof status === 'object' ? status : body);
        status = (typeof status === 'number' ? status : this.statusCode);
        if (typeof body === 'object') {
            body = JSON.stringify(body);
        }
        if (typeof body === 'string') {
            this.set('Content-Length', body.length);
        }
        let buffer = protocol + ' ' + status + ' ' + this._statusMessage(status) + CRLF;
        Object.keys(this.headers).forEach(field => {
            buffer += field + ':' + this.headers[field] + CRLF;
        });
        buffer += CRLF;
        if (body) {
            buffer += body;
        }
        this.socket.write(buffer);
    }
}
exports.Response = Response;
//# sourceMappingURL=response.js.map