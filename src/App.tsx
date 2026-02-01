import React, { useState } from "react";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { Todo } from "./model";
import "./App.css";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      setTodos([...todos, { id: Date.now(), todo: todo, isDone: false }]);
      setTodo(""); // empty the input field after
    }
  };

  console.log(todos);

  return (
    <div className="App">
      <span className="heading">Taskify</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos}/>
      {todos.map((t) => (
        <li>{t.todo}</li>
      ))}
    </div>
  );
};

export default App;
