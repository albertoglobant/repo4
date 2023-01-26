module.exports = function(req, res, next){
    if(!req.user.isAdmin)return res.status(403).send({'error': 'Access denied. you do not have adminstrator permission'})
    next()
}