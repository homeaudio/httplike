"use strict";
const parser_1 = require("./parser");
const RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/;
class ClientMessage extends parser_1.Message {
    constructor(protocol, statusCode, statusMessage) {
        super();
        this.protocol = protocol;
        this.statusCode = statusCode;
        this.statusMessage = statusMessage;
    }
}
exports.ClientMessage = ClientMessage;
class ClientParser extends parser_1.Parser {
    _constructMessage(firstLine) {
        const m = RE_HEADER.exec(firstLine);
        if (m === null) {
            throw new Error('Unable to parse first line');
        }
        const res = new parser_1.Message();
        const protocol = m[1];
        const statusCode = Number(m[2]);
        const statusMessage = m[3];
        return new ClientMessage(protocol, statusCode, statusMessage);
    }
    _emitMessage(msg) {
        this.emit('message', msg);
    }
}
exports.ClientParser = ClientParser;
//# sourceMappingURL=client-parser.js.map