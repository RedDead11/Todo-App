import React, { useRef } from "react";
import "./styles.css";

interface Props {
  todo: string; // Current input
  setTodo: React.Dispatch<React.SetStateAction<string>>; // func to update it
  handleAdd: (e: React.FormEvent) => void; // func to ADD todo
}

const InputField: React.FC<Props> = ({ todo, setTodo, handleAdd }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form
      className="input" 
      onSubmit={(e) => {
        handleAdd(e); // Add the todo (called from App.tsx)
        inputRef.current?.blur();
      }}
    >
      <input
        ref={inputRef}  // connects to the ref above
        type="text"
        value={todo}
        onChange={(e) => setTodo(e.target.value)}
        id="task-input"
        placeholder=" "
        className="input__box"
      />

      <label htmlFor="task-input" className="input__label">
        Enter a task
      </label>

      <button className="input__submit" type="submit">
        +
      </button>
    </form>
  );
};

export default InputField;
