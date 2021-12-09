const jwt = require('jsonwebtoken');

const auth= function(req,res,next ){
    const token=req.header('Authorization')
    if(token){
        try {
            const  varified = jwt.verify(token,process.env.TOKEN_SECRET)
            console.log(varified._id);
            req.user=varified._id;
            next();
        } catch (error) {
            res.status(401).send('Access denied');
        }

    }else{

        res.status(401).send(token);
    }
}
module.exports=auth