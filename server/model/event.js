// const mongoose = require('mongoose');
// const validator = require('validator');

// //bill
// var Schema = mongoose.Schema;
// var event = new Schema({
//     content:{
//         type:String,
//         required:true,
//         validate(v){
//             if(!validator.isLength(v,{min:2,max:400})) throw new Error("La longueur du contenu de l'article doit etre comprise entre 2 et 400 caracteres!");
//         }
//     },
//     title:{
//         type:String,
//         required:true,
//         validate(v){
//             if(!validator.isLength(v,{min:2,max:128})) throw new Error("La longueur du contenu de l'article doit etre comprise entre 2 et 128 caracteres!");
//         }
//     },
//     user: {
//         type: mongoose.SchemaTypes.ObjectId,
//         ref: 'Member',
//         required:true
//     }
// });

// module.exports = mongoose.model('Bill', billModel);