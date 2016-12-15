import * as debug from 'debug'
import { Socket } from 'net'
import { Parser, Message } from './parser'
import { Response, ResponseOptions } from './response'

const log = debug('httplike:received')

export class ServerRequest extends Message {
    method: string
    path: string
    protocol: string

    constructor(method: string, path: string, protocol: string) {
        super()
        this.method = method
        this.path = path
        this.protocol = protocol
    }

    toString() {
        let str = super.toString()
        return str += `\nMETHOD: ${this.method} PATH: ${this.path} PROTOCOL: ${this.protocol}`
    }
}

export class ServerParser extends Parser {

    private responseOptions: ResponseOptions

    constructor(socket: Socket, responseOptions: ResponseOptions) {
        super(socket)
        this.responseOptions = responseOptions
    }

    _constructMessage(firstLine: string) {
        const parts = firstLine.trim().split(' ')
        const method = parts[0].toUpperCase()
        const path = parts[1]
        const protocol = parts[2]
        return new ServerRequest(method, path, protocol)
    }

    _emitMessage(msg: ServerRequest) {
        log(msg)
        this.emit('message', msg, new Response(this._socket, this.responseOptions))
    }

}
