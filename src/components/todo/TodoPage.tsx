import React, { useState, useEffect, useMemo } from "react";
import TodoItem, { ITodo } from "./TodoItem";
import PomodoroTimer from "./Pomodoro";
import "./TodoPage.css";

const TodoPage: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [activePomodoro, setActivePomodoro] = useState<{ id: number; task: string; completed: boolean } | null>(null);
  const [todoList, setTodoList] = useState(() => {
    const savedList = localStorage.getItem('todoList');
    return savedList ? JSON.parse(savedList) : [];
  });
  const [counter, setCounter] = useState(() => {
    const savedCounter = localStorage.getItem('counter');
    return savedCounter ? JSON.parse(savedCounter) : 1;
  });
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('todoList', JSON.stringify(todoList));
    localStorage.setItem('counter', counter.toString());
    localStorage.setItem('filter', filter);
  }, [todoList, counter, filter]);

  const addTodo = () => {
    const task = inputValue.trim();
    if (task) {
      setTodoList([...todoList, { id: counter, task, completed: false }]);
      setCounter(counter + 1);
      setInputValue('');
    }
  };

  const toggleComplete = (index: number) => {
    const newList = [...todoList];
    newList[index].completed = !newList[index].completed;
    setTodoList(newList);
  };

  const editTodo = (index: number, newTask: string) => {
    const updatedTasks = [...todoList];
    updatedTasks[index].task = newTask;
    setTodoList(updatedTasks);
  };

  const deleteTodo = (index: number) => {
    const newList = todoList.filter((_: any, i: number) => i !== index);
    setTodoList(newList);
  };

  const handlePomodoroClick = (item: { id: number; task: string; completed: boolean }) => {
    setActivePomodoro(item);
  };

  const filteredList = useMemo(() => todoList.filter((item: { completed: boolean }) => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item.completed;
    if (filter === 'incomplete') return !item.completed;
  }), [todoList, filter]);

  return (
    <div className="content-container">
      <h1>Urania's To Do List</h1>
      <p>Something you need to do...</p>
      
      <div className="filter-buttons">
        <button onClick={() => setFilter('all')} className={filter==="all" ? "filter-button active" : "filter-button"}>All</button>
        <button onClick={() => setFilter('completed')} className={filter==="completed" ? "filter-button active" : "filter-button"}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={filter==="incomplete" ? "filter-button active" : "filter-button"}>Incomplete</button>
      </div>

      <ol id="list">
        {filteredList.map((item: ITodo, index: number) => (
          <TodoItem
            key={item.id}
            item={item}
            index={index}
            toggleComplete={toggleComplete}
            editTodo={editTodo}
            deleteTodo={deleteTodo}
            onPomodoroClick={handlePomodoroClick}
            categories={[]}            
          />
        ))}
      </ol>

      <input
        type="text"
        placeholder="New task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button onClick={addTodo}>Submit</button>

      {activePomodoro && (
        <div className="pomodoro-outsidecontainer">
          <div className="pomodoro-header">
            <h3>🍅 Pomodoro for: {activePomodoro.task}</h3>
            {/* <button className="pomodoro-close" onClick={() => setActivePomodoro(null)}>✖</button> */}
          </div>
          <PomodoroTimer onClose={() => setActivePomodoro(null)} />
        </div>
      )}
    </div>
  );
};

export default TodoPage;
