import { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {

    const [tasks, setTasks] = useState([]);
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [activeLog, setActiveLog] = useState(null);
    const [elapsed, setElapsed] = useState(0);

    const token = localStorage.getItem("token");

    const formatTime = (seconds) => {

        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${hrs.toString().padStart(2,"0")}:${mins
            .toString()
            .padStart(2,"0")}:${secs
            .toString()
            .padStart(2,"0")}`;
    };

    const fetchTasks = async () => {

        try {

            const res = await axios.get(
                "http://localhost:5000/tasks",
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setTasks(res.data);

        } catch(error){

            console.log(error);

        }
    };

    const fetchLogs = async()=>{

        try{

            const res = await axios.get(
                "http://localhost:5000/timelog",
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setLogs(res.data);

        }catch(error){

            console.log(error);

        }
    };

    const fetchSummary = async()=>{

        try{

            const res = await axios.get(
                "http://localhost:5000/summary",
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setSummary(res.data);

        }catch(error){

            console.log(error);

        }
    };

    useEffect(()=>{

        fetchTasks();
        fetchLogs();
        fetchSummary();

    },[]);

    useEffect(()=>{

        let interval;

        if(activeLog){

            interval = setInterval(()=>{

                const sec = Math.floor(
                    (
                        Date.now() -
                        new Date(activeLog.startTime)
                    ) / 1000
                );

                setElapsed(sec);

            },1000);

        }

        return ()=>clearInterval(interval);

    },[activeLog]);

    const refreshAll = ()=>{

        fetchTasks();
        fetchLogs();
        fetchSummary();

    };

    const createTask = async()=>{

        try{

            await axios.post(
                "http://localhost:5000/tasks",
                {
                    title,
                    description
                },
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setTitle("");
            setDescription("");

            refreshAll();

        }catch(error){

            console.log(error);

        }
    };

    const updateTask = async()=>{

        try{

            await axios.put(
                `http://localhost:5000/tasks/${editingId}`,
                {
                    title,
                    description
                },
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setEditingId(null);
            setTitle("");
            setDescription("");

            refreshAll();

        }catch(error){

            console.log(error);

        }
    };

    const deleteTask = async(id)=>{

        try{

            await axios.delete(
                `http://localhost:5000/tasks/${id}`,
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            refreshAll();

        }catch(error){

            console.log(error);

        }
    };

    const updateStatus = async(id,status)=>{

        try{

            await axios.put(
                `http://localhost:5000/tasks/${id}`,
                {
                    status
                },
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            refreshAll();

        }catch(error){

            console.log(error);

        }
    };

    const startEdit=(task)=>{

        setEditingId(task._id);
        setTitle(task.title);
        setDescription(task.description);

    };

    const startTimer = async(taskId)=>{

        try{

            const res = await axios.post(
                "http://localhost:5000/timelog/start",
                { taskId },
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setElapsed(0);
            setActiveLog(res.data);

        }catch(error){

            console.log(error);

        }
    };

    const stopTimer = async()=>{

        try{

            await axios.post(
                "http://localhost:5000/timelog/stop",
                {
                    logId:activeLog._id
                },
                {
                    headers:{
                        Authorization:token
                    }
                }
            );

            setActiveLog(null);
            setElapsed(0);

            refreshAll();

        }catch(error){

            console.log(error);

        }
    };

    const logout = ()=>{

        localStorage.removeItem("token");
        window.location.href="/";

    };

    return (

        <div style={{padding:"30px"}}>

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center"
                }}
            >
                <h1>Task Dashboard</h1>

                <button onClick={logout}>
                    Logout
                </button>
            </div>

            {

                summary &&

                <div
                    style={{
                        display:"flex",
                        gap:"20px",
                        marginBottom:"20px"
                    }}
                >

                    <div style={{
                        border:"1px solid black",
                        padding:"10px"
                    }}>
                        Tasks: {summary.totalTasks}
                    </div>

                    <div style={{
                        border:"1px solid black",
                        padding:"10px"
                    }}>
                        Completed: {summary.completed}
                    </div>

                    <div style={{
                        border:"1px solid black",
                        padding:"10px"
                    }}>
                        Pending: {summary.pending}
                    </div>

                    <div style={{
                        border:"1px solid black",
                        padding:"10px"
                    }}>
                        Time: {formatTime(summary.totalTime)}
                    </div>

                </div>

            }

            {

                activeLog &&

                <h2>
                    Running:
                    {formatTime(elapsed)}
                </h2>

            }

            <div
                style={{
                    display:"flex",
                    flexDirection:"column",
                    gap:"10px",
                    width:"300px"
                }}
            >

                <input
                    placeholder="Task title"
                    value={title}
                    onChange={(e)=>
                        setTitle(e.target.value)
                    }
                />

                <input
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>
                        setDescription(e.target.value)
                    }
                />

                <button
                    onClick={
                        editingId
                        ? updateTask
                        : createTask
                    }
                >
                    {
                        editingId
                        ? "Update Task"
                        : "Add Task"
                    }
                </button>

            </div>

            <hr/>

            <h2>Your Tasks</h2>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(4,1fr)",
                    gap:"20px",
                    marginTop:"20px"
                }}
            >

                {

                    tasks.map((task)=>(

                        <div
                            key={task._id}
                            style={{
                                border:"1px solid black",
                                padding:"15px",
                                borderRadius:"10px",
                                minHeight:"230px",
                                boxSizing:"border-box"
                            }}
                        >

                            <h3>{task.title}</h3>

                            <p>{task.description}</p>

                            <select
                                value={task.status}
                                onChange={(e)=>
                                    updateStatus(
                                        task._id,
                                        e.target.value
                                    )
                                }
                            >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>

                            <br/><br/>

                            <button
                                onClick={()=>
                                    startEdit(task)
                                }
                            >
                                Edit
                            </button>

                            <button
                                style={{
                                    marginLeft:"10px"
                                }}
                                onClick={()=>
                                    deleteTask(task._id)
                                }
                            >
                                Delete
                            </button>

                            <br/><br/>

                            {

                                activeLog &&
                                activeLog.taskId===task._id

                                ?

                                <button onClick={stopTimer}>
                                    Stop
                                </button>

                                :

                                <button
                                    onClick={()=>
                                        startTimer(task._id)
                                    }
                                >
                                    Start
                                </button>

                            }

                        </div>

                    ))

                }

            </div>

            <hr/>

            <h2>Time Logs</h2>

            {

                logs.map((log)=>(

                    <div
                        key={log._id}
                        style={{
                            border:"1px solid gray",
                            padding:"10px",
                            marginTop:"10px"
                        }}
                    >

                        <p>
                            Task:
                            {log.taskId?.title}
                        </p>

                        <p>
                            Duration:
                            {formatTime(log.duration)}
                        </p>

                    </div>

                ))

            }

        </div>
    );
}

export default Dashboard;