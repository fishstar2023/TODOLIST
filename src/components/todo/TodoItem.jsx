import { useState } from 'react'

export default function TodoItem({ item, index, toggleComplete, editTodo, deleteTodo,onPomodoroClick }) {
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
          <button onClick={() => onPomodoroClick(item, index)}>Pomodoro</button>
        </>
      )}
    </li>
  );
}