const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const User = require('./../models/User');
const { encodePass, encodeToken } = require('./../helpers/encoding');
const { token } = require('./../config');

passport.use('local_login', new LocalStrategy({
		usernameField:'username',
		passwordField:'password'
	},
	async  (username, password, done) => {
        try {
            const user = await User.findOne({$or:[ {username:username}, {email:username} ]});
            
            if( !user )            
				return done(null, false, { message : 'Usuario no encontrado'});
				
			const result = await User.findOne({$and: [{$or:[ {username:username}, {email:username} ]},{password: encodePass(password)}]})
			
            //si existe verificar contraseña
            if(!result)
                return done(null, false, { message : 'Contraseña incorrecta'});
            else
                return done(null, user, { message : 'Login exitoso'});
        } catch (err) {
            return done(err)
        }
        
	}
))


const opts = {
	secretOrKey: token,
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
passport.use(new JwtStrategy(opts, async (jwt_payload, done) =>{
    try {
		const user = await User.findOne({$or: [{username:jwt_payload.username}, {email:jwt_payload.username}]});
		
        if(! user) return done(null, false, { message : 'Usuario inexistente'});

        return done(null, user);    //usuario encontrado
    } catch (error) {
        return done(err)
    }
}));

const login = (req,res,next)=>{
    passport.authenticate('local_login', {session:false}, (err,user,info)=>{
    
        if(err || !user) return res.status(400).json({...info, token:null});


        req.login(user,{session:false}, err=>{
            if(err) return next(err);

            const token = encodeToken({username:user.username});
            return res.status(200).json({message:'inicio de sesion exitoso', token});
        });
    })(req, res);
}

module.exports = {
	verifyAuth: passport.authenticate('jwt',{session:false}),
	login
};