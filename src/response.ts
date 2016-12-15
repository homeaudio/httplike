import * as debug from 'debug'
import { STATUS_CODES } from 'http'
import { Socket } from 'net'
const CRLF = '\r\n'

const log = debug('httplike:response')

export interface ResponseOptions {
	statusMessages? : { [key:string]: string}
	protocol?: string
}

export class Response {

	statusCode = 200
	headers: { [key: string]: string | number } = {}
	private options: ResponseOptions
	private socket: Socket
	private bodyStringified?: string

	constructor(socket: Socket, options: ResponseOptions = {}) {
		this.socket = socket
		this.options = options
	}

	get statusMessage() {
		const fromOptions = (this.options.statusMessages || {})[this.statusCode]
		const fromHttp = STATUS_CODES[this.statusCode]
		return fromOptions || fromHttp
	}

	get body() {
		return this.bodyStringified ? JSON.parse(this.bodyStringified) : undefined
	}

	set body(body: Object) {
		this.bodyStringified = JSON.stringify(body)
		this.headers['content-length'] = this.bodyStringified.length
	}

	send() {
		const protocol = this.options.protocol || 'HTTP/1.1'

		let buffer = `${protocol} ${this.statusCode} ${this.statusMessage}${CRLF}`

		Object.keys(this.headers).forEach(field => {
			buffer += field + ':' + this.headers[field] + CRLF
		})

		buffer += CRLF
		if (this.body) {
			buffer += this.bodyStringified
		}
		log(this)
		this.socket.write(buffer)
	}

	inspect(depth: number, optionsIn: any) {
		const obj: any = this
		const {socket, options, ...x} = obj
		return x
	}
}
