const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
    title:{type:String, required:true},
    article:{type:String, required:true},
    authorname:{type:String, required:true},
    articleImage:{type:String, required:true},
    postDate:{type: Date,default: Date.now},

});
module.exports = Article = mongoose.model('article',ArticleSchema);