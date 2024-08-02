import React, { useState } from "react";
import NewTodo from "./components/NewTodo";
import UpdateTodo from "./components/UpdateTodo";

const HeroSection = ({
  newForm,
  todos,
  fetchTodos,
  toggleNewTodoForm,
  handleDelete,
  handleLogout,
}) => {
  const [handleShow, sethandleShow] = useState(false);
  const [item, setItem] = useState({});

  const handleUpdate = async (item) => {
    setItem(item);
    sethandleShow(!handleShow);
  };

  const todosList = todos.map((todo) => {
    return (
      <li key={todo._id} className="todo_card__list">
        <span className="todo_card__list__content">{todo.title}</span>
        <span className="todo_card__list__content">{todo.desc}</span>
        <span className="todo_card__list__buttons">
          <button
            className="btn btn-primary"
            onClick={() => handleUpdate(todo)}
          >
            Update Task
          </button>
          <button
            className="btn btn-primary"
            onClick={() => handleDelete(todo._id)}
          >
            Delete Task
          </button>
        </span>
      </li>
    );
  });

  return (
    <div className="hero">
      {handleShow && (
        <UpdateTodo
          item={item}
          fetchTodos={fetchTodos}
          sethandleShow={sethandleShow}
        />
      )}

      {newForm && (
        <div>
          <NewTodo
            fetchTodos={fetchTodos}
            toggleNewTodoForm={toggleNewTodoForm}
          />
        </div>
      )}

      {/* List of existing todos */}
      {todos.length > 0 && (
        <div className="todo_card">
          <ul style={{ listStyleType: "none" }}>{todosList}</ul>
        </div>
      )}

      <button className="btn btn-primary" onClick={() => handleLogout()}>
        Logout
      </button>
    </div>
  );
};

export default HeroSection;
