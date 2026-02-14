import React, { useRef, useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
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

  const handleEditSave = async () => {
    if (editText.trim() === "") return;

    try {
      // Update in Supabase
      const { error } = await supabase
        .from("todos")
        .update({ todo: editText })
        .eq("id", todo.id);

      if (error) throw error;

      // Update local state
      setTodos(
        todos.map((t) => (t.id === todo.id ? { ...t, todo: editText } : t))
      );
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating todo:", error);
      alert("Failed to update todo");
    }
  };  

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "Escape") {
      handleEditSave();
    }
  };

  const handleDelete = async () => {
    playDeleteSound();
    setIsDeleting(true);

    setTimeout(async () => {
      try {
        // Delete from Supabase
        const { error } = await supabase
          .from("todos")
          .delete()
          .eq("id", todo.id);

        if (error) throw error;

        // Remove from local state
        setTodos(todos.filter((t) => t.id !== todo.id));
      } catch (error) {
        console.error("Error deleting todo:", error);
        alert("Failed to delete todo");
        setIsDeleting(false);
      }
    }, 300);
  };

  const handleDone = async () => {
    try {
      // Update in Supabase
      const { error } = await supabase
        .from("todos")
        .update({ is_done: !todo.isDone })
        .eq("id", todo.id);

      if (error) throw error;

      // Update local state
      const updatedTodos = todos.map((t) =>
        t.id === todo.id ? { ...t, isDone: !t.isDone } : t
      );

      // Sort: incomplete first, completed last
      const sortedTodos = [
        ...updatedTodos.filter((t) => !t.isDone),
        ...updatedTodos.filter((t) => t.isDone),
      ];

      setTodos(sortedTodos);
    } catch (error) {
      console.error("Error toggling todo:", error);
      alert("Failed to update todo");
    }
  };

  return (
    <form
      className={`todo-card
      ${todo.isDone ? "todo-card--done" : ""} 
      ${isDeleting ? "todo-card--deleting" : ""}
      ${isEntering ? "todo-card--enter" : ""}
    `}
    onSubmit={(e) => e.preventDefault()}
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
