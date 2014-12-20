///<reference path='boris-typedefs/node/node.d.ts'/>
///<reference path='boris-typedefs/passport/passport.d.ts'/>
///<reference path='../node_modules/promise-ts/promise-ts.d.ts'/>
///<reference path='typedefs/passport-google.d.ts'/>
///<reference path='user_interface.ts'/>

import Passport = require("passport");
import Config = require("./config");
import Google = require("passport-google");
import Util = require("util");
import User = require("./user_model");

var baseUrl = Config.url.protocol + "://" + Config.url.hostname + "/";
var returnUrl = baseUrl + "auth/google/return";

var strategy = new (Google.Strategy)({
		returnURL: returnUrl,
		realm: baseUrl,
		stateless: true
	},
	function (identifier, profile, done) {
		User.findOne({
			"openid.identifier": identifier
		}, (err, user)=> {
			if (err) {
				return done(err);
			}
			if (user) {
				// Returning user
				Util.log("Returning User Signing In");
				Util.log(user.consoleText);
				done(null, user);
			} else {
				// Make a new user
				Util.log("New User Sigining In");
				User.create({
					openid: {
						identifier: identifier,
						profile: profile
					}
				}, (err, user) => {
					Util.log(user.consoleText);
					done(err, user);
				});
			}
		});
	});

module P {
	export function init(){
		Passport.use(strategy);
		Passport.serializeUser((user, cb) => {
			cb(null, user.id);
		});
		Passport.deserializeUser(User.findById);
	}
}

export = P