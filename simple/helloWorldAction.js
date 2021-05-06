const os = require('os')
 
function main(params) {
    const name = params && params.name || 'anonymous'

    // Retrieve some info about the operating environment 
    const hostname = os.hostname()
    const cpu = os.cpus()
    const arch = os.arch()
    const net = os.networkInterfaces()
    const freeMem = os.freemem()
    const platform = os.platform()

    const message = `Hello ${name}!`

    const body = JSON.stringify({
        name,
        hostname,
        cpu,
        arch,
        net,
        freeMem,
        platform,
        message
    })

    const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body
    }

    return response
}