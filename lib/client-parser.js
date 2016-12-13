"use strict";
const parser_1 = require("./parser");
const message_1 = require("./message");
const RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/;
class ClientParser extends parser_1.Parser {
    _constructMessage(firstLine) {
        const res = new message_1.Message();
        const m = RE_HEADER.exec(firstLine);
        if (m === null) {
            throw new Error('Unable to parse first line');
        }
        res.protocol = m[1];
        res.statusCode = Number(m[2]);
        res.statusMessage = m[3];
        return res;
    }
    _emitMessage(msg) {
        this.emit('message', msg);
    }
}
exports.ClientParser = ClientParser;
//# sourceMappingURL=client-parser.js.map