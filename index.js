const { generateToken } = require('kruger')
const main = async () => {
    const result = await generateToken({ _id: 123, _randomSecretKey: true, _randomSecretKeyLevel: 2,_expirationTime:'15D' })
    console.log(result)
}

main()