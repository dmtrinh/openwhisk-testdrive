const crypto = require('crypto-js')

function encryptPayload(params) {
    var originalText

    if (params != null)
        if (params.body != undefined)
            originalText = params.body
        else 
            originalText = params 
    else
        originalText = 'You got nothing.  Nada.  Zilch!'
    
    const cipherText = crypto.AES.encrypt(originalText, 'secretKey123!').toString()

    const body = JSON.stringify({
        cipherText
    })
    
    const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body
    }

    console.log(response)
    return response
}

function decryptPayload(params) {
    var bytes = crypto.AES.decrypt(params, 'secretKey123!')
    var decrypted = bytes.toString(crypto.enc.Utf8)
    console.log("Decrypted:\n" + decrypted)
}

exports.main = encryptPayload;
exports.decrypt = decryptPayload;