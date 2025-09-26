// src/components/TodoCalendarPage.tsx
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import TodoItem, { ITodo } from "./todo/TodoItem";
import TodoPage from "./todo/TodoPage";


interface ITodoWithMeta extends ITodo {
  date: string;
  category: string;
}

interface CategoryType {
  name: string;
  color: string;
}

const fixedColors = ["#A88FC8", "#B19F8D", "#CBB592", "#E1A6A2", "#A46B4F"];

const TodoCalendarPage: React.FC = () => {
  // Todo state
  const [todos, setTodos] = useState<ITodoWithMeta[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTodo, setNewTodo] = useState("");
  const [todoDate, setTodoDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [todoCategory, setTodoCategory] = useState("");

  // Categories
  const [categories, setCategories] = useState<CategoryType[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Work", color: fixedColors[0] },
          { name: "Life", color: fixedColors[1] },
          { name: "Hobby", color: fixedColors[2] },
        ];
  });

  // Persist
  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);
  useEffect(() => localStorage.setItem("categories", JSON.stringify(categories)), [categories]);

  // Handlers
  const addTodo = () => {
    if (!newTodo.trim()) return;
    const newItem: ITodoWithMeta = {
      id: Date.now(),
      task: newTodo,
      completed: false,
      date: todoDate,
      category: todoCategory,
    };
    setTodos(prev => [...prev, newItem]);
    setNewTodo("");
    setTodoDate(format(new Date(), "yyyy-MM-dd"));
    setTodoCategory("");
  };

  const toggleComplete = (index: number) => {
    const updated = [...todos];
    updated[index].completed = !updated[index].completed;
    setTodos(updated);
  };

  const editTodo = (index: number, newTask: string, newDate: string, newCategory: string) => {
    const updated = [...todos];
    updated[index] = { ...updated[index], task: newTask, date: newDate, category: newCategory };
    setTodos(updated);
  };

  const deleteTodo = (index: number) => {
    setTodos(prev => prev.filter((_, i) => i !== index));
  };

  const onPomodoroClick = (item: ITodoWithMeta, index: number) => {
    alert(`Start Pomodoro for: ${item.task}`);
  };

  return (
    <div className="content-container">
      <h1>📝 To-Do List</h1>

      {/* 新增 Todo */}
      <div className="todo-input" style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="New task"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <input
          type="date"
          value={todoDate}
          onChange={(e) => setTodoDate(e.target.value)}
        />
        <select value={todoCategory} onChange={(e) => setTodoCategory(e.target.value)}>
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.name} value={c.name}>{c.name}</option>
          ))}
        </select>
        <button onClick={addTodo} className="submit-btn">Add</button>
      </div>

      {/* Todo List */}
      <ul id="list">
        {todos.map((item, index) => (
          <li key={item.id} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <TodoItem
              item={item}
              index={index}
              toggleComplete={toggleComplete}
              editTodo={(i, task) => editTodo(i, task, item.date, item.category)}
              deleteTodo={deleteTodo}
              onPomodoroClick={(it, i) => onPomodoroClick(it as ITodoWithMeta, i)}
            />
            <div style={{ fontSize: "0.85rem", color: "#555" }}>
              <span>📅 {item.date}</span>{" | "}
              <span>🏷️ {item.category || "No category"}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoCalendarPage;
