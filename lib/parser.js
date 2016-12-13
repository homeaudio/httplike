"use strict";
const stream_1 = require("stream");
const LINE_TERMINATOR = '\r\n';
const HEADER_TERMINATOR = [0x0D, 0x0A, 0x0D, 0x0A];
class Parser extends stream_1.Writable {
    constructor(socket, options) {
        super(options);
        this._buffer = new Buffer(0);
        this._collectingContent = -1;
        this._headerData = null;
        this._output = null;
        this.options = options;
        this.on('pipe', src => this._socket = src);
        if (socket) {
            socket.pipe(this);
        }
    }
    parseHeader(header) {
        const lines = header.split(LINE_TERMINATOR);
        const firstLine = lines.shift();
        const message = this._constructMessage(firstLine);
        const headers = lines.reduce((headers, line) => {
            const idx = line.indexOf(':');
            const key = line.substring(0, idx).trim();
            const val = line.substring(idx + 1).trim();
            if (idx === -1) {
                throw new Error('Invalid header (' + line + ')');
            }
            headers[key.toLowerCase()] = val;
            return headers;
        }, {});
        message.headers = headers;
        const hasContent = headers.hasOwnProperty('content-length');
        const contentLength = (hasContent ? Number(headers['content-length']) : 0);
        return {
            message: message,
            contentLength: contentLength
        };
    }
    _write(chunk, encoding, cb) {
        this._buffer = Buffer.concat([this._buffer, chunk]);
        while (true) {
            if (this._collectingContent === -1) {
                const idxTerminator = bufferIndexOf(this._buffer, HEADER_TERMINATOR);
                if (idxTerminator === -1) {
                    return cb(null);
                }
                let info;
                try {
                    info = this.parseHeader(this._buffer.slice(0, idxTerminator).toString());
                }
                catch (err) {
                    return cb(err);
                }
                this._headerData = info;
                this._buffer = this._buffer.slice(idxTerminator + HEADER_TERMINATOR.length);
                if (this._headerData.contentLength === 0) {
                    this._emitMessage(this._headerData.message);
                }
                else {
                    this._collectingContent = this._headerData.contentLength;
                }
            }
            else {
                if (this._buffer.length < this._collectingContent) {
                    return cb(null);
                }
                this._headerData.message.content = this._buffer.slice(0, this._collectingContent);
                this._emitMessage(this._headerData.message);
                this._buffer = this._buffer.slice(this._collectingContent);
                this._collectingContent = -1;
            }
        }
    }
}
exports.Parser = Parser;
function bufferIndexOf(haystack, needle) {
    const nLen = needle.length;
    const max = haystack.length - nLen;
    outer: for (let i = 0; i <= max; i++) {
        for (let j = 0; j < nLen; j++) {
            if (haystack[i + j] !== needle[j]) {
                continue outer;
            }
        }
        return i;
    }
    return -1;
}
//# sourceMappingURL=parser.js.map