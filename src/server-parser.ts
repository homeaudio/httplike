import { Parser } from './parser'
import { Message } from './message'
import { Response } from './response'

export class ServerParser extends Parser {

    _constructMessage(firstLine: string) {

        const req = new Message()
        const parts = firstLine.trim().split(' ')

        req.method = parts[0].toUpperCase()
        req.path = parts[1]
        req.protocol = parts[2]

        return req
    }

    _emitMessage(msg: Message) {
        this.emit('message', msg, new Response(this._socket, this.options))
    }

}
