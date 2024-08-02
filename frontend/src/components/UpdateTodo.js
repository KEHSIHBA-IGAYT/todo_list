import React from "react";
import axios from "axios";
import { useState } from "react";
import config from "../config";

const UpdateTodo = (props) => {
  const [newTodo, setNewTodo] = useState({
    title: props.item.title,
    desc: props.item.desc,
  });

  // const [modalshow, setShow] = useState(false);
  // const handleClose = () => setShow(false);
  // const handleShow = () => setShow(true);

  //handle new todo changes
  const handleInputChange = (e) => {
    setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
  };

  //Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = sessionStorage.getItem("token");
    try {
      await axios.request({
        method: "PUT",
        url: `${config.API_BASE_URL}/todos?id=${props.item._id}`,
        headers: { Authorization: `Bearer ${token}` },
        data: newTodo,
      });

      props.sethandleShow(false);
      props.fetchTodos();
    } catch (error) {
      console.error("Error creating todo:", error);
    }
  };

  return (
    <div>
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
        <button type="submit">Save Task</button>
      </form>
    </div>
  );
};

export default UpdateTodo;
