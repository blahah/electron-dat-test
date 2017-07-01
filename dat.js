var mirror = require('mirror-folder')
var datnode = require('dat-node')
var key = 'd227462da452654cca9d3830ac242e954a7743189d27d2948c2acff605e01803'

module.exports = function (dir) {
  return datnode(dir, { key: key, sparse: true }, function (err, dat) {
    if (err) throw err

    var network = dat.joinNetwork()
    network.once('connection', function () {
      console.log('Connected')
    })
    dat.archive.metadata.update(download)

    function download () {
      var progress = mirror({ fs: dat.archive, name: '/' }, dir, function (err) {
        if (err) {
          console.error(err)
          process.exit(1)
        }
      })

      progress.on('put', function (src) {
        console.log('Downloading', src.name)
      })
    }

    console.log(`Downloading: ${dat.key.toString('hex')} to ${dir}\n`)
  })
}
