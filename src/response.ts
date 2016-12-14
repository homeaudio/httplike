import { STATUS_CODES } from 'http'
import { Socket } from 'net'

const CRLF = '\r\n'

export interface ResponseOptions {
	statusMessages? : { [key:string]: string}
	protocol?: string
}

export class Response {

	statusCode = 200
	headers: { [key: string]: string | number } = {}
	options: ResponseOptions
	private socket: Socket
	private _bodyStringified?: string

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
		return this._bodyStringified ? JSON.parse(this._bodyStringified) : undefined
	}

	set body(body: Object) {
		this._bodyStringified = JSON.stringify(body)
		this.headers['Content-Length'] = this._bodyStringified.length
	}

	send() {
		const protocol = this.options.protocol || 'HTTP/1.1'

		let buffer = `${protocol} ${this.statusCode} ${this.statusMessage}${CRLF}`
		Object.keys(this.headers).forEach(field => {
			buffer += field + ':' + this.headers[field] + CRLF
		})

		buffer += CRLF
		if (this.body) {
			buffer += this.body
		}
		this.socket.write(buffer)
	}
}
