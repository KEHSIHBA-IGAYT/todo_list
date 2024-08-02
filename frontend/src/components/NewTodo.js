import React from "react";
import axios from "axios";
import { useState } from "react";
import config from "../config";

const NewTodo = ({ fetchTodos, toggleNewTodoForm }) => {
  const [newTodo, setNewTodo] = useState({ title: "", desc: "" });

  //handle new todo changes
  const handleInputChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      axios.request({
        method: "POST",
        url: `${config.API_BASE_URL}/todos`,
        headers: { Authorization: `Bearer ${token}` },
        data: newTodo,
      });
      toggleNewTodoForm(false);
      fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="new_todo">
      <input
        type="text"
        name="title"
        value={newTodo.title}
        onChange={handleInputChange}
        placeholder="Todo title"
        required
      />
      <textarea
        type="text"
        name="desc"
        value={newTodo.desc}
        onChange={handleInputChange}
        placeholder="Todo description"
      />
      <button className="btn btn-primary" type="submit">
        Add Task
      </button>
    </form>
  );
};

export default NewTodo;
