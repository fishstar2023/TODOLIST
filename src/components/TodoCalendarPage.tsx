import React, { useState, useEffect } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns";
import PomodoroTimer from "./todo/Pomodoro";
import "./TodoCalendarPage.css";

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


const fixedColors = ["#A88FC8", "#B19F8D", "#CBB592", "#E1A6A2", "#A46B4F"];

const TodoCalendarPage: React.FC = () => {
  const [todos, setTodos] = useState<ITodo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [newTodo, setNewTodo] = useState("");
  const [todoDate, setTodoDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [todoCategory, setTodoCategory] = useState("");
  const [categories] = useState<CategoryType[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved
      ? JSON.parse(saved)
      : [
          { name: "Work", color: fixedColors[0] },
          { name: "Life", color: fixedColors[1] },
          { name: "Hobby", color: fixedColors[2] },
        ];
  });

  const [filter, setFilter] = useState("all");
  const [selectedDate, setSelectedDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [activePomodoro, setActivePomodoro] = useState<ITodo | null>(null);

  // 編輯狀態
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTask, setEditedTask] = useState("");
  const [editedDate, setEditedDate] = useState("");
  const [editedCategory, setEditedCategory] = useState("");

  // 日曆顯示月份
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => localStorage.setItem("todos", JSON.stringify(todos)), [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setTodos(prev => [
      ...prev,
      { id: Date.now(), task: newTodo, completed: false, date: todoDate, category: todoCategory },
    ]);
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

  const filteredTodos = todos.filter(todo => {
    if (filter === "all") return true;
    if (filter === "completed") return todo.completed;
    if (filter === "incomplete") return !todo.completed;
    return true;
  });

  // 日曆
  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start, end });

  const handleDayClick = (day: Date) => setSelectedDate(format(day, "yyyy-MM-dd"));
  const todosOnSelectedDate = todos.filter(todo => todo.date === selectedDate);

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  return (
    <div className="todo-calendar-container">
      <h1>📝 To-Do List</h1>
      <div className="todo-calendar-grid">
        {/* 左側 Todo */}
        <div className="todo-left">
          <div className="filter-buttons">
            {["all", "completed", "incomplete"].map(f => (
              <button
                key={f}
                className={`filter-button ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="todo-input">
            <input
              type="text"
              placeholder="New task..."
              value={newTodo}
              onChange={e => setNewTodo(e.target.value)}
            />
            <input type="date" value={todoDate} onChange={e => setTodoDate(e.target.value)} />
            <select value={todoCategory} onChange={e => setTodoCategory(e.target.value)}>
              <option value="">Select category</option>
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <button className="submit-btn" onClick={addTodo}>Add</button>
          </div>

          <ul className="todo-list">
            {filteredTodos.map((item, index) => (
              <li key={item.id} className="todo-list-item">
                <div className="todo-left-content">
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => toggleComplete(index)}
                  />
                  {editingTodoId === item.id ? (
                    <>
                      <input value={editedTask} onChange={e => setEditedTask(e.target.value)} />
                      <input type="date" value={editedDate} onChange={e => setEditedDate(e.target.value)} />
                      <select value={editedCategory} onChange={e => setEditedCategory(e.target.value)}>
                        {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </>
                  ) : (
                    <>
                      <span
                        className="todo-category"
                        style={{ backgroundColor: categories.find(c => c.name === item.category)?.color || "#E1A6A2", marginRight: "6px" }}
                      >
                        {item.category || "No category"}
                      </span>
                      <span className="todo-date">{format(new Date(item.date), "yyyy-MM-dd")}</span>
                      <span className="todo-task">{item.task}</span>
                    </>
                  )}
                </div>
                <div className="todo-actions">
                  {editingTodoId === item.id ? (
                    <button
                      onClick={() => {
                        editTodo(index, editedTask, editedDate, editedCategory);
                        setEditingTodoId(null);
                      }}
                    >
                      Save
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingTodoId(item.id);
                          setEditedTask(item.task);
                          setEditedDate(item.date);
                          setEditedCategory(item.category);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => deleteTodo(index)}>Delete</button>
                      <button onClick={() => setActivePomodoro(item)}>🍅</button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* 右側小日曆 */}
        <div className="todo-right">
          <div className="calendar-container">
            <div className="month-navigation">
              <button onClick={handlePrevMonth}>◀</button>
              <span className="month-label">{format(currentMonth, "MMMM yyyy")}</span>
              <button onClick={handleNextMonth}>▶</button>
            </div>

            <div className="calendar-weekdays">
              {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(day => (
                <div key={day} className="calendar-weekday">{day}</div>
              ))}
            </div>

            <div className="calendar-grid">
              {Array.from({ length: start.getDay() }).map((_, i) => (
                <div key={`empty-${i}`} className="calendar-day empty"></div>
              ))}
              {daysInMonth.map(day => {
                const todosOnDay = todos.filter(todo => isSameDay(new Date(todo.date), day));
                return (
                  <div
                    key={day.toString()}
                    className={`calendar-day ${selectedDate === format(day,"yyyy-MM-dd") ? "selected" : ""}`}
                    onClick={() => handleDayClick(day)}
                  >
                    <span>{day.getDate()}</span>
                    <div className="day-todos">
                      {todosOnDay.map(todo => (
                        <span
                          key={todo.id}
                          className="event-dot"
                          style={{ backgroundColor: categories.find(c => c.name===todo.category)?.color || "#A88FC8"}}
                          title={`${todo.task} (${todo.category})`}
                        />
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 當日待辦清單 */}
          <div className="date-todos-list">
            <h4>Todos on {selectedDate}</h4>
            <ul>
              {todosOnSelectedDate.length === 0 && <li>No todos</li>}
              {todosOnSelectedDate.map((todo, index) => {
                const todoIndex = todos.findIndex(t => t.id === todo.id);
                return (
                  <li key={todo.id} className="todo-list-item">
                    <div className="todo-left-content">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleComplete(todoIndex)}
                      />
                      <span
                        className="todo-category"
                        style={{ backgroundColor: categories.find(c => c.name === todo.category)?.color || "#E1A6A2", marginRight: "6px" }}
                      >
                        {todo.category || "No category"}
                      </span>
                      <span className="todo-task">{todo.task}</span>
                    </div>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {activePomodoro && <PomodoroTimer onClose={() => setActivePomodoro(null)} />}
    </div>
  );
};

export default TodoCalendarPage;
