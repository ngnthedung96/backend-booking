import Users from "../users/model.mjs";
import * as dotenv from "dotenv";
dotenv.config();

// for authenticate
import passport from "passport";
import passportJWT from "passport-jwt";
const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;
var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.SECRET_KEY;

// lets create our strategy for web token
var strategy = new JwtStrategy(jwtOptions, async (jwt_payload, next) => {
  var user = await Users.findOne({
    phone: jwt_payload.phone,
    roleId: jwt_payload.roleId,
  });
  if (user) {
    next(null, user);
  } else {
    next(
      {
        statusCode: 401,
        message: "Unauthorized, Token fail",
      },
      null
    );
  }
});

// use the strategy
passport.use(strategy);

export default {
  init: function () {
    return passport.initialize();
  },
  authenticate: function (req, res, next) {
    return passport.authenticate(
      "jwt",
      {
        session: false,
      },
      async (err, user) => {
        if (!user) {
          return next({
            statusCode: 401,
            message: "Unauthorized, User not found!",
          });
        }

        // Forward user information to the next middleware
        console.log(user);
        req.user = user;
        next();
      }
    )(req, res, next);
  },
};
