#!/usr/bin/env node

import express from 'express'
import path from 'path'
import open from 'open'
import serveIndex from 'serve-index'

const app = express()

const root = path.resolve(process.argv.slice(2).join(''))
console.log('root directory is: "' + root + '"')

const port = seededRandom(1025, 65534)

app.use(express.static(root), serveIndex('.', { 'icons': true }))

app.listen(port, () => {
	console.log('http://localhost:' + port + '/')
	open('http://localhost:' + port + '/')
})

// used to always use the same port for a given folder

function seededRandom(min, max) {
	let seed = xmur3(root)()

	seed = (seed * 9301 + 49297) % 233280
	let rnd = seed / 233280

	return (min + rnd * (max - min)) | 0
}

function xmur3(str) {
	for (var i = 0, h = 1779033703 ^ str.length; i < str.length; i++)
		(h = Math.imul(h ^ str.charCodeAt(i), 3432918353)), (h = (h << 13) | (h >>> 19))
	return function () {
		h = Math.imul(h ^ (h >>> 16), 2246822507)
		h = Math.imul(h ^ (h >>> 13), 3266489909)
		return (h ^= h >>> 16) >>> 0
	}
}
