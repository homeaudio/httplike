import { STATUS_CODES } from 'http'
import { Socket } from 'net'

const CRLF = '\r\n'

export class Response {

	statusCode = 200
	headers: { [key: string]: string | number } = {}
	socket: Socket
	options: {
		statusMessages?
		protocol?
	}

	constructor(socket: Socket, options) {
		this.socket = socket
		this.options = options || {}
		this.headers = {}
	}

	_statusMessage(statusCode) {
		const fromOptions = (this.options.statusMessages || {})[statusCode]
		const fromHttp = STATUS_CODES[statusCode]

		return (fromOptions || fromHttp)
	}

	status(statusCode: number) {
		this.statusCode = statusCode
		return this
	}

	get(field: string) {
		return this.headers[field]
	}

	set(field: string, value: string | number) {
		this.header(field, value)
	}

	header(field: string, value: string | number) {
		this.headers[field] = value
	}

	send(status, body) {
		const protocol = this.options.protocol || 'HTTP/1.1'

		body = (typeof status === 'string' || typeof status === 'object' ? status : body)
		status = (typeof status === 'number' ? status : this.statusCode)

		if (typeof body === 'object') {
			body = JSON.stringify(body)
		}

		if (typeof body === 'string') {
			this.set('Content-Length', body.length)
		}

		let buffer = protocol + ' ' + status + ' ' + this._statusMessage(status) + CRLF
		Object.keys(this.headers).forEach(field => {
			buffer += field + ':' + this.headers[field] + CRLF
		})

		buffer += CRLF
		if (body) {
			buffer += body
		}
		this.socket.write(buffer)
	}
}
