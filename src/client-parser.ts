import { Parser, Message } from './parser'

const RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/


export class ClientMessage extends Message {
    statusMessage: string
    statusCode: number
    protocol: string

    constructor(protocol: string, statusCode: number, statusMessage: string) {
        super()
        this.protocol = protocol
        this.statusCode = statusCode
        this.statusMessage = statusMessage
    }
}


export class ClientParser extends Parser {

    _constructMessage(firstLine: string) {

        const m = RE_HEADER.exec(firstLine)

        if (m === null) {
            throw new Error('Unable to parse first line')
        }
        const res = new Message()

        const protocol = m[1]
        const statusCode = Number(m[2])
        const statusMessage = m[3]

        return new ClientMessage(protocol, statusCode, statusMessage)
    }

    _emitMessage(msg: Message) {
        this.emit('message', msg)
    }

}
