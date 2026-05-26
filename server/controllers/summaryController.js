const Task = require("../models/Task");
const TimeLog = require("../models/TimeLog");

exports.getSummary = async(req,res)=>{

try{

const userId = req.user.id;

const tasks = await Task.find({
    userId
});

const logs = await TimeLog.find({
    userId
});

const totalTime = logs.reduce(
    (sum,log)=>
        sum + (log.duration || 0),
    0
);

const completed = tasks.filter(
    task=>task.status==="Completed"
).length;

const pending = tasks.filter(
    task=>task.status!=="Completed"
).length;

res.json({

    totalTasks:tasks.length,
    completed,
    pending,
    totalTime

});

}catch(error){

res.status(500).json(error);

}
};