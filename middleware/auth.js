const jwt = require('jsonwebtoken')
const JWTSECRET = 'Gdesk-gidPlus-87;9'

function auth(req, res, next){
    let jwtToken = req.header('Authorization')
    if(!jwtToken) return res.status(401).send({'error': 'Access denied. We need a valid token'})
    jwtToken = jwtToken.split(' ')[1]
    if(!jwtToken) return res.status(401).send({'error': 'Access denied. We need a valid token'})

    try{
        const payload = jwt.verify(jwtToken, JWTSECRET)
        console.log('token payload')
        console.log(payload)
        req.user = payload
        next()
    }catch(e){
        res.status(400).send({'error': 'Access denied. invalid token'})
    }
}

module.exports = auth