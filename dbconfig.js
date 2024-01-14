const mongoose=require('mongoose');

async function getConnect(){
    await mongoose.connect('mongodb://127.0.0.1:27017/todolist');
    const todolistschema=new mongoose.Schema({
        // ID:Number,
        // userdata:{
        //     uname:String,
        //     work:String,
        //     age:Number
        // },
        // password:Number,
        // city:String
        id:Number,
        name:String,
        email:String,
        password:String,
        topic:String,
        notes:String,
        created_at:{
            type:Date,
            require:true,
            default:Date.now
        }
    });
    return todolistschema;
}

module.exports=getConnect;
// module.exports=mongoose.models.getconnect() || mongoose.model('getconnect',PostSchema);