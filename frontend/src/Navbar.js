import React from "react";

const Navbar = ({ toggleNewTodoForm }) => {
  return (
    <div className="navbar">
      <button
        className="btn btn-primary navbar__add"
        onClick={() => toggleNewTodoForm(true)}
      >
        New Task
      </button>
    </div>
  );
};

export default Navbar;
