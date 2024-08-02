import axios from "axios";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import config from "./config";
import "./App.css";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [newForm, setNewForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [authForm, setAuthForm] = useState({ username: "", password: "" });
  const [isLogin, setIsLogin] = useState(true);

  //Initial Render
  useEffect(() => {
    console.log("rerendering");
    const token = sessionStorage.getItem("token");
    if (token) {
      setLoggedIn(true);
      fetchTodos();
    }
  }, []);

  //Set auth token to session storage
  const setAuthToken = (token) => {
    sessionStorage.setItem("token", token);
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const fetchTodos = async () => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.get(`${config.API_BASE_URL}/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      const data = response && response.data;
      setTodos(data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const handleAuthInputChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value.trim() });
  };

  //Login or register using credentials
  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      if (authForm.username === "" || authForm.password === "") {
        alert("Credentials can not be blank!!!");
        return;
      }
      const endpoint = isLogin ? "login" : "register";
      const response = await axios.post(
        `${config.API_BASE_URL}/${endpoint}`,
        authForm
      );

      if (response.data.token) {
        setAuthToken(response.data.token);
        setLoggedIn(true);
        fetchTodos();
      }
      if (endpoint === "register") {
        alert("Registered Successfully. Please proceed to login");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    setLoggedIn(false);
    setTodos([]);
  };

  const toggleNewTodoForm = (signal) => {
    setNewForm(signal);
  };

  // handle delete
  const handleDelete = async (id) => {
    try {
      const token = sessionStorage.getItem("token");
      await axios.request({
        method: "DELETE",
        url: `${config.API_BASE_URL}/todos?id=${id}`,
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="App">
      {loggedIn ? (
        <>
          <Navbar toggleNewTodoForm={toggleNewTodoForm} />
          <HeroSection
            newForm={newForm}
            todos={todos}
            fetchTodos={fetchTodos}
            toggleNewTodoForm={toggleNewTodoForm}
            handleDelete={handleDelete}
            handleLogout={handleLogout}
          />
        </>
      ) : (
        <div className="authform">
          <h1 className="header">{isLogin ? "Login" : "Register"}</h1>
          <form onSubmit={handleAuth} className="hero">
            <input
              type="text"
              name="username"
              value={authForm.username}
              onChange={handleAuthInputChange}
              placeholder="Username"
              required
            />
            <input
              type="password"
              name="password"
              value={authForm.password}
              onChange={handleAuthInputChange}
              placeholder="Password"
              required
            />
            <button className="btn btn-primary" type="submit">
              {isLogin ? "Login" : "Register"}
            </button>
          </form>
          <button
            className="btn btn-primary"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Need to register?" : "Already have an account?"}
          </button>
        </div>
      )}
    </div>
  );
}
