const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt
const {
    Admin
} = require('../model/admin/admin');
const keys = require('./key')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = (passport) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload);
        return done()
        // Admin.findById(jwt_payload.id)
        //     .then(admin => {
        //         if (admin) {
        //             //此处会将admin信息写入req.admin
        //             return done(null, admin)
        //         }
        //         return done(null, false)
        //     }).catch(err => {
        //         console.log(err)
        //     })
    }))
}

//引入passport模块并配置
// const passport = require('passport');
// app.use(passport.initialize())
// app.use(passport.session())
// require('./config/passport')(passport);

admin.get("/current", passport.authenticate('jwt', {
    session: false
}), (req, res) => {
    res.json({
        msg: "success"
    });
})

