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
                "https://task-tracker-app-2lo6.onrender.com/tasks",
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
                "https://task-tracker-app-2lo6.onrender.com/timelog",
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
                "https://task-tracker-app-2lo6.onrender.com/summary",
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
                "https://task-tracker-app-2lo6.onrender.com/tasks",
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
                `https://task-tracker-app-2lo6.onrender.com/tasks/${editingId}`,
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
                `https://task-tracker-app-2lo6.onrender.com/tasks/${id}`,
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
                `https://task-tracker-app-2lo6.onrender.com/tasks/${id}`,
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
                "https://task-tracker-app-2lo6.onrender.com/timelog/start",
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
                "https://task-tracker-app-2lo6.onrender.com/timelog/stop",
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

        <div
            style={{
                minHeight:"100vh",
                background:"#111827",
                color:"white",
                padding:"30px",
                fontFamily:"Arial"
            }}
        >

            <div
                style={{
                    display:"flex",
                    justifyContent:"space-between",
                    alignItems:"center",
                    marginBottom:"30px"
                }}
            >
                <h1
                    style={{
                        fontSize:"34px"
                    }}
                >
                    Productivity Dashboard
                </h1>

                <button
                    onClick={logout}
                    style={{
                        background:"#ef4444",
                        color:"white",
                        border:"none",
                        padding:"10px 18px",
                        borderRadius:"8px",
                        cursor:"pointer"
                    }}
                >
                    Logout
                </button>
            </div>

            {

                summary &&

                <div
                    style={{
                        display:"grid",
                        gridTemplateColumns:"repeat(4,1fr)",
                        gap:"20px",
                        marginBottom:"30px"
                    }}
                >

                    <div style={{
                        background:"#1f2937",
                        padding:"20px",
                        borderRadius:"12px"
                    }}>
                        <h3>Total Tasks</h3>
                        <h2>{summary.totalTasks}</h2>
                    </div>

                    <div style={{
                        background:"#065f46",
                        padding:"20px",
                        borderRadius:"12px"
                    }}>
                        <h3>Completed</h3>
                        <h2>{summary.completed}</h2>
                    </div>

                    <div style={{
                        background:"#92400e",
                        padding:"20px",
                        borderRadius:"12px"
                    }}>
                        <h3>Pending</h3>
                        <h2>{summary.pending}</h2>
                    </div>

                    <div style={{
                        background:"#1e3a8a",
                        padding:"20px",
                        borderRadius:"12px"
                    }}>
                        <h3>Tracked Time</h3>
                        <h2>{formatTime(summary.totalTime)}</h2>
                    </div>

                </div>

            }

            {

                activeLog &&

                <div
                    style={{
                        background:"#2563eb",
                        padding:"15px",
                        borderRadius:"10px",
                        marginBottom:"20px"
                    }}
                >
                    Running Timer:
                    {formatTime(elapsed)}
                </div>

            }

            <div
                style={{
                    background:"#1f2937",
                    padding:"20px",
                    borderRadius:"12px",
                    marginBottom:"30px",
                    display:"flex",
                    gap:"10px"
                }}
            >

                <input
                    placeholder="Task title"
                    value={title}
                    onChange={(e)=>
                        setTitle(e.target.value)
                    }
                    style={{
                        flex:1,
                        padding:"12px",
                        borderRadius:"8px",
                        border:"none"
                    }}
                />

                <input
                    placeholder="Description"
                    value={description}
                    onChange={(e)=>
                        setDescription(e.target.value)
                    }
                    style={{
                        flex:2,
                        padding:"12px",
                        borderRadius:"8px",
                        border:"none"
                    }}
                />

                <button
                    onClick={
                        editingId
                        ? updateTask
                        : createTask
                    }
                    style={{
                        background:"#2563eb",
                        color:"white",
                        border:"none",
                        padding:"12px 20px",
                        borderRadius:"8px",
                        cursor:"pointer"
                    }}
                >
                    {
                        editingId
                        ? "Update"
                        : "Add Task"
                    }
                </button>

            </div>

            <div
                style={{
                    display:"grid",
                    gridTemplateColumns:"repeat(4,1fr)",
                    gap:"20px"
                }}
            >

                {

                    tasks.map((task)=>(

                        <div
                            key={task._id}
                            style={{
                                background:"#1f2937",
                                padding:"20px",
                                borderRadius:"12px"
                            }}
                        >

                            <h3>{task.title}</h3>

                            <p
                                style={{
                                    color:"#cbd5e1"
                                }}
                            >
                                {task.description}
                            </p>

                            <select
                                value={task.status}
                                onChange={(e)=>
                                    updateStatus(
                                        task._id,
                                        e.target.value
                                    )
                                }
                                style={{
                                    width:"100%",
                                    padding:"10px",
                                    borderRadius:"8px",
                                    marginBottom:"15px"
                                }}
                            >
                                <option>Pending</option>
                                <option>In Progress</option>
                                <option>Completed</option>
                            </select>

                            <div
                                style={{
                                    display:"flex",
                                    gap:"10px",
                                    marginBottom:"10px"
                                }}
                            >

                                <button
                                    onClick={()=>
                                        startEdit(task)
                                    }
                                    style={{
                                        flex:1,
                                        background:"#2563eb",
                                        color:"white",
                                        border:"none",
                                        padding:"10px",
                                        borderRadius:"8px"
                                    }}
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={()=>
                                        deleteTask(task._id)
                                    }
                                    style={{
                                        flex:1,
                                        background:"#dc2626",
                                        color:"white",
                                        border:"none",
                                        padding:"10px",
                                        borderRadius:"8px"
                                    }}
                                >
                                    Delete
                                </button>

                            </div>

                            {

                                activeLog &&
                                activeLog.taskId===task._id

                                ?

                                <button
                                    onClick={stopTimer}
                                    style={{
                                        width:"100%",
                                        background:"#f59e0b",
                                        color:"white",
                                        border:"none",
                                        padding:"10px",
                                        borderRadius:"8px"
                                    }}
                                >
                                    Stop Timer
                                </button>

                                :

                                <button
                                    onClick={()=>
                                        startTimer(task._id)
                                    }
                                    style={{
                                        width:"100%",
                                        background:"#16a34a",
                                        color:"white",
                                        border:"none",
                                        padding:"10px",
                                        borderRadius:"8px"
                                    }}
                                >
                                    Start Timer
                                </button>

                            }

                        </div>

                    ))

                }

            </div>

            <h2
                style={{
                    marginTop:"40px"
                }}
            >
                Time Logs
            </h2>

            {

                logs.map((log)=>(

                    <div
                        key={log._id}
                        style={{
                            background:"#1f2937",
                            padding:"15px",
                            borderRadius:"10px",
                            marginTop:"10px"
                        }}
                    >

                        <p>
                            {log.taskId?.title}
                        </p>

                        <p
                            style={{
                                color:"#94a3b8"
                            }}
                        >
                            {formatTime(log.duration)}
                        </p>

                    </div>

                ))

            }

        </div>
    );
}

export default Dashboard;