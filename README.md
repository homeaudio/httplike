httplike
========

node.js package for parsing http-like protocols

# IMPORTANT NOTE - TYPESCRIPT FORK

This is a fork of [stephen/httplike](https://github.com/stephen/httplike) that @jabooth undertook for fun in Dec 2016. I moved `httplike` and a handful of other projects to Typescript and placed them under a new namespace at [github/homeaudio](https://github.com/homeaudio/) in an effort to better understand and rapidly improve all these interrelated projects.

For now I'm maintaining my forks at [github/homeaudio](https://github.com/homeaudio/), but I would be delighted if these forks were re-unified with their original projects at some point. Given the extensive nature of the changes made though, I understand that this may be challenging for the original authors.

## Installation
```
npm install @homeaudio/httplike
```

## Usage
```typescript
import { ServerParser } from 'httplike'
const p = new Parser(socket)
p.on('message', (msg) => {
  console.log(msg.method)
  console.log(msg.headers)
  console.log(msg.content)
})
```

## Protocol Assumptions

```httplike``` assumes that the incoming protocol follows HTTP standards on using the Content-Length header to determine how many bytes to wait for in a response body.

## Changelog

##### 2.0.0
- Migration to Typescript
- Adoption of ES2015+ style and features
- New fork maintained at @homeaudio for now

##### 1.0.1
- Fixed parsing involving UTF-8 characters (PR #8), and potential stall in pipelined requests (PR #9)

##### 1.0.0
- Removed ```parseHeader``` from public interface on `ClientParser` and `ServerParser`

##### 0.0.9
- Removed dependency on ```lodash```

##### 0.0.7
- Implemented built-in response object modeled after express.js response.
- Added ```trim()``` to method and headers

##### 0.0.5
- Breaking changes to how headers are accessed (```getHeader()``` function instead of ```headers[]```). See tests for example usage.
