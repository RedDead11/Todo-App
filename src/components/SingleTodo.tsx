import React, { useRef, useState, useEffect } from "react";
import { Todo } from "../model";
import "./styles.css";
import editIcon from "../Images/Edit Icon.png";
import deleteIcon from "../Images/delete icon.png";
import doneIcon from "../Images/complete icon.png";

type Props = {
  todo: Todo;
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const SingleTodo = ({ todo, todos, setTodos }: Props) => {
  const [isEntering, setIsEntering] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.todo);

  const inputRef = useRef<HTMLInputElement>(null);

  const deleteSoundRef = useRef<HTMLAudioElement>(
    new Audio("/sounds/delete.mp3"),
  );

  const playDeleteSound = () => {
    const audio = deleteSoundRef.current;
    audio.currentTime = 0; // restart if already playing
    audio.volume = 0.3;
    audio.play();
  };

  // focus input when editing starts
  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }

    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [isEditing]);

  const handleEditSave = () => {
    if (editText.trim() === "") return;
    setTodos(
      todos.map((t) => (t.id === todo.id ? { ...t, todo: editText } : t)),
    );
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleEditSave();
    }
  };

  const handleDelete = () => {
    playDeleteSound();
    setIsDeleting(true);

    setTimeout(() => {
      setTodos(todos.filter((t) => t.id !== todo.id));
    }, 300);
  };

  const handleDone = () => {
    const updatedTodos = todos.map((t) =>
      t.id === todo.id ? { ...t, isDone: !t.isDone } : t,
    );

    // move completed todos to the end
    const sortedTodos = [
      ...updatedTodos.filter((t) => !t.isDone),
      ...updatedTodos.filter((t) => t.isDone),
    ];

    setTodos(sortedTodos);
  };

  return (
    <form
      className={`todo-card
      ${todo.isDone ? "todo-card--done" : ""} 
      ${isDeleting ? "todo-card--deleting" : ""}
      ${
        isEntering
          ? todo.id % 2 === 0
            ? "todo-card--enter--even"
            : "todo-card--enter--odd"
          : ""
      }
    `}
    >
      <div className="todo-text">
        {isEditing ? (
          <input
            ref={inputRef}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleEditSave} // save when input loses focus
            onKeyDown={handleKeyPress} // save on Enter
            className="todo-edit-input"
          />
        ) : (
          <span>{todo.todo}</span>
        )}
      </div>

      <div className="todo-icons-holder">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setIsEditing(true)} // enable editing
        >
          <img src={editIcon} alt="Edit" />
        </button>

        <button type="button" className="icon-btn" onClick={handleDelete}>
          <img src={deleteIcon} alt="Delete" />
        </button>

        <button type="button" className="icon-btn" onClick={handleDone}>
          <img src={doneIcon} alt="Done" />
        </button>
      </div>
    </form>
  );
};

export default SingleTodo;
