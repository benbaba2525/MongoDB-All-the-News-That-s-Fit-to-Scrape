var mongoose = require("mongoose");


var Schema = mongoose.Schema;

var ArticleSchema = new Schema ({
    headline: {
        type: String,
        required: true
    },
    summaryOne: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    img: {
		type: String,
		// default: "/assets/images/unavailable.jpg"
	},
    saved: {
        type: Boolean,
        default: false
    },
    note: 
        []
    
});

var Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;