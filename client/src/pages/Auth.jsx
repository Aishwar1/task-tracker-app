import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);
    const [message, setMessage] = useState("");

    const [formData, setFormData] = useState({
        email:"",
        password:""
    });

    const handleChange = (e)=>{

        setFormData({
            ...formData,
            [e.target.name]:e.target.value
        });

        setMessage("");

    };

    const handleSubmit = async(e)=>{

        e.preventDefault();

        setMessage("");

        try{

            const url = isLogin
                ? "https://task-tracker-app-2lo6.onrender.com/auth/login"
                : "https://task-tracker-app-2lo6.onrender.com/auth/signup";

            const res = await axios.post(
                url,
                formData
            );

            if(res.data.token){

                localStorage.setItem(
                    "token",
                    res.data.token
                );

                navigate("/dashboard");

            }else{

                setMessage(
                    "Account created successfully. Please login."
                );

                setIsLogin(true);

            }

        }catch(error){

            console.log(error);

            const msg =
                error?.response?.data?.message;

            if(
                msg === "User not found"
            ){

                setMessage(
                    "You need to create an account first."
                );

            }

            else if(
                msg === "Invalid credentials"
            ){

                setMessage(
                    "Incorrect password."
                );

            }

            else if(
                msg === "User already exists"
            ){

                setMessage(
                    "Account already exists. Please login."
                );

            }

            else{

                setMessage(
                    msg ||
                    "Something went wrong."
                );

            }

        }
    };

    return (

        <div
            style={{
                minHeight:"100vh",
                background:"#111827",
                display:"flex",
                justifyContent:"center",
                alignItems:"center",
                fontFamily:"Arial"
            }}
        >

            <div
                style={{
                    width:"420px",
                    background:"#1f2937",
                    padding:"40px",
                    borderRadius:"18px",
                    boxShadow:"0 10px 30px rgba(0,0,0,0.4)"
                }}
            >

                <h1
                    style={{
                        color:"white",
                        marginBottom:"10px",
                        textAlign:"center",
                        fontSize:"32px"
                    }}
                >
                    Task Tracker
                </h1>

                <p
                    style={{
                        color:"#94a3b8",
                        textAlign:"center",
                        marginBottom:"25px"
                    }}
                >
                    {
                        isLogin
                        ?
                        "Login to continue"
                        :
                        "Create your account"
                    }
                </p>

                {

                    message &&

                    <div
                        style={{
                            background:"#374151",
                            color:"#fbbf24",
                            padding:"12px",
                            borderRadius:"8px",
                            marginBottom:"18px",
                            textAlign:"center",
                            fontSize:"14px"
                        }}
                    >
                        {message}
                    </div>

                }

                <form
                    onSubmit={handleSubmit}
                    style={{
                        display:"flex",
                        flexDirection:"column",
                        gap:"18px"
                    }}
                >

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{
                            padding:"14px",
                            borderRadius:"10px",
                            border:"none",
                            outline:"none",
                            background:"#374151",
                            color:"white",
                            fontSize:"15px"
                        }}
                    />

                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{
                            padding:"14px",
                            borderRadius:"10px",
                            border:"none",
                            outline:"none",
                            background:"#374151",
                            color:"white",
                            fontSize:"15px"
                        }}
                    />

                    <button
                        type="submit"
                        style={{
                            background:"#2563eb",
                            color:"white",
                            border:"none",
                            padding:"14px",
                            borderRadius:"10px",
                            cursor:"pointer",
                            fontSize:"16px",
                            fontWeight:"bold"
                        }}
                    >
                        {
                            isLogin
                            ?
                            "Login"
                            :
                            "Signup"
                        }
                    </button>

                </form>

                <p
                    onClick={()=>{
                        setIsLogin(!isLogin);
                        setMessage("");
                    }}
                    style={{
                        marginTop:"25px",
                        color:"#60a5fa",
                        textAlign:"center",
                        cursor:"pointer"
                    }}
                >
                    {
                        isLogin
                        ?
                        "Don't have an account? Signup"
                        :
                        "Already have an account? Login"
                    }
                </p>

            </div>

        </div>

    );
}

export default Auth;