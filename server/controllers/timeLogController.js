const TimeLog = require("../models/TimeLog");

exports.startTimer = async(req,res)=>{

try{

const log = await TimeLog.create({

    taskId:req.body.taskId,
    userId:req.user.id,
    startTime:new Date()

});

res.status(201).json(log);

}catch(error){

res.status(500).json(error);

}
};

exports.stopTimer = async(req,res)=>{

try{

const log = await TimeLog.findById(
    req.body.logId
);

log.endTime = new Date();

log.duration = Math.floor(

    (log.endTime - log.startTime)
    /1000

);

await log.save();

res.status(200).json(log);

}catch(error){

res.status(500).json(error);

}
};

exports.getLogs = async(req,res)=>{

try{

const logs = await TimeLog.find({

    userId:req.user.id

}).populate("taskId");

res.status(200).json(logs);

}catch(error){

res.status(500).json(error);

}
};