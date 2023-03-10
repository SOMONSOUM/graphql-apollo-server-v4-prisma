import * as jose from 'jose'

const generateKeys = async () => {
    const { privateKey } = await jose.generateKeyPair(
        process.env.ALGO as string
    )
    const pkcs8Pem = await jose.exportPKCS8(privateKey)

    console.log(pkcs8Pem)
}

generateKeys()



