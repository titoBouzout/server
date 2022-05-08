// for closing the cmd window as soon as possible
;['SIGTERM', 'SIGINT', 'SIGUSR2', 'SIGBREAK'].forEach(function (m) {
	process.on(m, function () {
		process.exit()
	})
})

const fs = require('fs'),
	http = require('http'),
	path = require('path'),
	exec = require('child_process').exec,
	open = require('open')

const root = path.resolve(process.argv.slice(2).join(''))

console.log('root directory is: "' + root + '"')
;(function server() {
	const port = seededRandom(1025, 65534)

	open('http://localhost:' + port + '/')

	console.log('http://localhost:' + port + '/')

	http
		.createServer(async function (req, res) {
			const request = req.url.replace(/^\//, '').replace(/\?.*/g, '')
			let file = path.join(root, decodeURIComponent(request))
			let folder = file.replace(root, '')
			console.log('requested ' + file)

			// index.html resolution

			const index = path.join(file, 'index.html')
			file = (await exists(index)) ? index : file

			try {
				// serve directory
				if (isDirectory(file)) {
					console.log('serving directory', file)

					fs.readdir(file, (err, files) => {
						let content = '<h1>' + file + '</h1><hr/><ul>'

						files.forEach(f => {
							let link = path.join(folder, f).replace(/\\/g, '/')
							content += '<li><a href="' + link + '">' + f + '</a>'
						})
						res.writeHead(200)
						res.end(content)
					})
				} else if (await exists(file)) {
					console.log('serving file 200', file)

					// serve file
					res.writeHead(200)
					res.end(Buffer.from(await fs.promises.readFile(file)))
				} else {
					console.log('Not Found 404', file)

					// Not Found
					res.writeHead(404)
					res.end()
				}
			} catch (e) {
				res.writeHead(500)
				res.end(Buffer.from(JSON.stringify(e)))
			}
		})
		.listen(port)
})()

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

function isDirectory(f) {
	try {
		return fs.lstatSync(f).isDirectory()
	} catch (e) {
		return false
	}
}

function exists(f) {
	return fs.promises
		.lstat(f)
		.then(stat => {
			return true
		})
		.catch(err => {
			return false
		})
}
