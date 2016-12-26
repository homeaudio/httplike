import { Parser, Message } from './parser'

const RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/


export class ClientMessage extends Message {

    constructor(readonly protocol: string,
                readonly statusCode: number,
                readonly statusMessage: string) {
        super()
    }
}


export class ClientParser extends Parser {

    _constructMessage(firstLine: string) {

        const m = RE_HEADER.exec(firstLine)

        if (m === null) {
            throw new Error('Unable to parse first line')
        }

        const protocol = m[1]
        const statusCode = Number(m[2])
        const statusMessage = m[3]

        return new ClientMessage(protocol, statusCode, statusMessage)
    }

    _emitMessage(msg: Message) {
        this.emit('message', msg)
    }

}
