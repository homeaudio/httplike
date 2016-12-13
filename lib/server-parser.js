"use strict";
const parser_1 = require("./parser");
const message_1 = require("./message");
const response_1 = require("./response");
class ServerParser extends parser_1.Parser {
    _constructMessage(firstLine) {
        const req = new message_1.Message();
        const parts = firstLine.trim().split(' ');
        req.method = parts[0].toUpperCase();
        req.path = parts[1];
        req.protocol = parts[2];
        return req;
    }
    _emitMessage(msg) {
        this.emit('message', msg, new response_1.Response(this._socket, this.options));
    }
}
exports.ServerParser = ServerParser;
//# sourceMappingURL=server-parser.js.map