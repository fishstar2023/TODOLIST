import { useState } from "react";
import "./TodoItem.css";

interface ITodo {
  id: number;
  task: string;
  completed: boolean;
  date: string;
  category: string;
}

interface CategoryType {
  name: string;
  color: string;
}

interface ITodoItemProps {
  item: ITodo;
  index: number;
  categories: CategoryType[];
  toggleComplete: (index: number) => void;
  editTodo: (index: number, newTask: string, newDate: string, newCategory: string) => void;
  deleteTodo: (index: number) => void;
  onPomodoroClick: (item: ITodo, index: number) => void;
}

export default function TodoItem({
  item,
  index,
  categories,
  toggleComplete,
  editTodo,
  deleteTodo,
  onPomodoroClick,
}: ITodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(item.task);
  const [editedDate, setEditedDate] = useState(item.date);
  const [editedCategory, setEditedCategory] = useState(item.category);

  const saveEdit = () => {
    editTodo(index, editedTask, editedDate, editedCategory);
    setIsEditing(false);
  };

  return (
    <li className="todo-item">
      <div className="todo-content">
        <input
          type="checkbox"
          checked={item.completed}
          onChange={() => toggleComplete(index)}
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
            />
            <input
              type="date"
              value={editedDate}
              onChange={(e) => setEditedDate(e.target.value)}
            />
            <select
              value={editedCategory}
              onChange={(e) => setEditedCategory(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))}
            </select>
            <button onClick={saveEdit}>Save</button>
          </>
        ) : (
          <span className={item.completed ? "completed" : ""}>{item.task}</span>
        )}
      </div>

      <div className="todo-actions">
        {!isEditing && <button onClick={() => setIsEditing(true)}>Edit</button>}
        <button onClick={() => deleteTodo(index)}>Delete</button>
        <button onClick={() => onPomodoroClick(item, index)} title="Start Pomodoro">
          🍅
        </button>
      </div>
    </li>
  );
}

export type { ITodo };
