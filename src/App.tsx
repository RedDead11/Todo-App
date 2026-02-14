import React, { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";
import InputField from "./components/InputField";
import TodoList from "./components/TodoList";
import { Todo } from "./model";
import "./App.css";

const App: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  // Load todos from Supabase when app starts
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform database format to our Todo format
      const loadedTodos: Todo[] = (data || []).map((item) => ({
        id: item.id,
        todo: item.todo,
        isDone: item.is_done,
      }));

      setTodos(loadedTodos);
    } catch (error) {
      console.error("Error loading todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!todo.trim()) return;

    try {
      // Save to Supabase
      const { data, error } = await supabase
        .from("todos")
        .insert([
          {
            user_id: null, // ← Changed from fake UUID to null
            todo: todo,
            is_done: false,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Detailed error:", error); // ← Better error logging
        throw error;
      }

      // Add to local state
      setTodos([
        {
          id: data.id,
          todo: data.todo,
          isDone: data.is_done,
        },
        ...todos,
      ]);

      setTodo("");
    } catch (error) {
      console.error("Error adding todo:", error);
      alert("Failed to add todo");
    }
  };

  if (loading) {
    return <div className="App">Loading...</div>;
  }

  return (
    <div className="App">
      <span className="heading">
        {"TASKIFY".split("").map((char, index) => (
          <span key={index} className="heading-char">
            {char}
          </span>
        ))}
      </span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  );
};

export default App;
