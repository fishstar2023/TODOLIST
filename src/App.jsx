import { useState, useEffect, useMemo } from 'react'

import TodoItem from './components/todo/TodoItem.jsx'
import Pomodoro from './components/todo/Pomodoro.jsx'
import PomodoroTimer from './components/todo/Pomodoro.jsx'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('');
  const [activePomodoro, setActivePomodoro] = useState(null);
  const [todoList, setTodoList] = useState(() => {
    const savedList = localStorage.getItem('todoList');
    return savedList ? JSON.parse(savedList) : [];
  });
  const [counter, setCounter] = useState(() => {
    const savedCounter = localStorage.getItem('counter');
    return savedCounter ? JSON.parse(savedCounter) : 1;
  });

  const [filter, setFilter] = useState('all'); // New state for filter
  
  // Save to localStorage whenever todoList or counter changes
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
  const toggleComplete = (index) => {
    const newList = [...todoList];
    newList[index].completed = !newList[index].completed;
    setTodoList(newList);
  };

  const editTodo = (index, newTask) => {
    const updatedTasks = [...todoList];
    updatedTasks[index].task = newTask;
    setTodoList(updatedTasks);
  };

  const deleteTodo = (index) => {
    const newList = todoList.filter((_, i) => i !== index);
    setTodoList(newList);
  };

  const handlePomodoroClick = (item) => {
    setActivePomodoro(item);
  };

  const filteredList = useMemo(() => todoList.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'completed') return item.completed;
    if (filter === 'incomplete') return !item.completed;
  }), [todoList, filter]);

 
  return (
    <div>
      <h1> Urania's To Do List</h1>
      <p> Something you need to do...</p>
      <div>
        <button onClick={() => setFilter('all')} className={filter==="all" ? "filter active" : "filter-button"}>All</button>
        <button onClick={() => setFilter('completed')} className={filter==="completed" ? "filter active" : "filter-button"}>Completed</button>
        <button onClick={() => setFilter('incomplete')} className={filter==="incomplete" ? "filter active" : "filter-button"}>Incomplete</button>
      </div>
      <ol id="list">
        {filteredList.map((item, index) => (
          <TodoItem
            key={index}
            item={item}
            index={index}
            toggleComplete={toggleComplete}
            editTodo={editTodo}
            deleteTodo={deleteTodo}
            onPomodoroClick={handlePomodoroClick}
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
       <div>
         <h3>Pomodoro for: {activePomodoro.task}</h3>
         <PomodoroTimer />
       </div>
     )}
    </div>
  )
}

export default App
