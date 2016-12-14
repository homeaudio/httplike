"use strict";
const parser_1 = require("./parser");
const response_1 = require("./response");
class ServerRequest extends parser_1.Message {
    constructor(method, path, protocol) {
        super();
        this.method = method;
        this.path = path;
        this.protocol = protocol;
    }
}
exports.ServerRequest = ServerRequest;
class ServerParser extends parser_1.Parser {
    constructor(socket, responseOptions) {
        super(socket);
        this.responseOptions = responseOptions;
    }
    _constructMessage(firstLine) {
        const parts = firstLine.trim().split(' ');
        const method = parts[0].toUpperCase();
        const path = parts[1];
        const protocol = parts[2];
        return new ServerRequest(method, path, protocol);
    }
    _emitMessage(msg) {
        this.emit('message', msg, new response_1.Response(this._socket, this.responseOptions));
    }
}
exports.ServerParser = ServerParser;
//# sourceMappingURL=server-parser.js.map