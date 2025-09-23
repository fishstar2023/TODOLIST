import { useState } from 'react'

interface ITodo { id: number; task: string; completed: boolean; }

interface ITodoItemProps {
  item: ITodo;
  index: number;
  toggleComplete: (index: number) => void;
  editTodo: (index: number, newTask: string) => void;
  deleteTodo: (index: number) => void;
  onPomodoroClick: (item: ITodo, index: number) => void;
}

export default function TodoItem(
  {
    item,
    index,
    toggleComplete,
    editTodo,
    deleteTodo,
    onPomodoroClick
  }: ITodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(item.task);

  const saveEdit = () => {
    editTodo(index, editedTask);
    setIsEditing(false);
  };

  return (
    <li>
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
          <button onClick={saveEdit}>Save</button>
        </>
      ) : (
        <>
          <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
            {item.task}
          </span>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={() => deleteTodo(index)}>Delete</button>
          <button onClick={() => onPomodoroClick(item, index)} className="todo-pomodoro-button" title="Start Pomodoro">🍅</button>
        </>
      )}
    </li>
  );
}

export type { ITodo };