const mongoose = require("mongoose");
require('dotenv').config();

module.exports = () => {
	const connectionParams = {
		useNewUrlParser: true,  // allow users to fall back to the old parser if they find a bug in the new parser.
		useUnifiedTopology: true, // DeprecationWarning: current Server Discovery and Monitoring engine is deprecated, 
		//and will be removed in a future version
	};

	try {
		mongoose.connect(process.env.DB, connectionParams);
		console.log("Connected to database successfully");
	} catch (error) {
		console.log(error);
		console.log("Could not connect database!");
	}
};
