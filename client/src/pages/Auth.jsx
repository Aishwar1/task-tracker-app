import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Auth() {

    const navigate = useNavigate();

    const [isLogin, setIsLogin] = useState(true);

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const url = isLogin
                ? "http://localhost:5000/auth/login"
                : "http://localhost:5000/auth/signup";

            const res = await axios.post(
                url,
                formData
            );

            console.log(res.data);

            if (isLogin && res.data.token) {

                localStorage.setItem(
                    "token",
                    res.data.token
                );

                alert("Login Successful");

                navigate("/dashboard");

            } else {

                alert("Signup Successful");

                setIsLogin(true);

            }

        } catch (error) {

            console.log(error);
            alert("Something went wrong");

        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh"
            }}
        >

            <form
                onSubmit={handleSubmit}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "300px"
                }}
            >

                <h2>
                    {isLogin ? "Login" : "Signup"}
                </h2>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <button type="submit">
                    {isLogin ? "Login" : "Signup"}
                </button>

                <p
                    style={{
                        cursor: "pointer",
                        color: "blue"
                    }}
                    onClick={() =>
                        setIsLogin(!isLogin)
                    }
                >
                    {isLogin
                        ? "Create account"
                        : "Already have account?"}
                </p>

            </form>

        </div>
    );
}

export default Auth;