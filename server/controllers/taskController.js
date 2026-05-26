const Task = require("../models/Task");

exports.createTask = async(req,res)=>{

try{

const task = await Task.create({

    userId:req.user.id,
    title:req.body.title,
    description:req.body.description

});

res.status(201).json(task);

}catch(error){

res.status(500).json(error);

}
}

exports.getTasks = async(req,res)=>{

try{

const tasks = await Task.find({
    userId:req.user.id
});

res.status(200).json(tasks);

}catch(error){

res.status(500).json(error);

}
}

exports.updateTask = async(req,res)=>{

try{

const task = await Task.findOneAndUpdate(

{
    _id:req.params.id,
    userId:req.user.id
},

req.body,

{
    new:true
}

);

res.status(200).json(task);

}catch(error){

res.status(500).json(error);

}
}


exports.deleteTask = async(req,res)=>{

try{

await Task.findOneAndDelete({

    _id:req.params.id,
    userId:req.user.id

});

res.status(200).json({
    message:"Task deleted"
});

}catch(error){

res.status(500).json(error);

}
}