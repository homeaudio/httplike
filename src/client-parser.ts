import { Parser } from './parser'
import { Message } from './message'

const RE_HEADER = /^([^ ]+) ([0-9]+) (.*)$/

export class ClientParser extends Parser {

    _constructMessage(firstLine: string) {

        const res = new Message()
        const m = RE_HEADER.exec(firstLine)

        if (m === null) {
            throw new Error('Unable to parse first line')
        }

        res.protocol = m[1]
        res.statusCode = Number(m[2])
        res.statusMessage = m[3]

        return res
    }

    _emitMessage(msg: Message) {
        this.emit('message', msg)
    }

}
