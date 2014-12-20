///<reference path='boris-typedefs/node/node.d.ts'/>
///<reference path='boris-typedefs/mongoose/mongoose.d.ts'/>
///<reference path='../node_modules/promise-ts/promise-ts.d.ts'/>

import Mongoose = require("mongoose");
import Config = require("./config");
import Promise = require("promise-ts");

module Mongo {
	export function connect() {
		var url = "mongodb://" + Config.mongodb.hostname
			+ "/" + Config.mongodb.db;

		var d = new Promise.Deferred();
		Mongoose.connect(url, (err) => {
			if (err) {
				d.reject(err);
			} else {
				d.resolve();
			}
		});
		return d.promise;
	}
}

export = Mongo;