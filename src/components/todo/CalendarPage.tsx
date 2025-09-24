import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format } from "date-fns";
import "./CalendarPage.css";

interface EventType {
  id: string;
  title: string;
  date: string;
  category?: string;
  color?: string;
}

interface CategoryType {
  name: string;
  color: string;
}

// 固定顏色
const fixedColors = ["#A88FC8", "#B19F8D", "#CBB592", "#E1A6A2", "#A46B4F"];

const CalendarPage: React.FC = () => {
  const navigate = useNavigate();

  const [events, setEvents] = useState<EventType[]>(() => {
    const saved = localStorage.getItem("events");
    return saved ? JSON.parse(saved) : [
      { id: "1", title: "Sample Event", date: "2025-09-25", category: "Work", color: fixedColors[0] },
    ];
  });

  const [categories, setCategories] = useState<CategoryType[]>(() => {
    const saved = localStorage.getItem("categories");
    return saved ? JSON.parse(saved) : [
      { name: "Work", color: fixedColors[0] },
      { name: "Life", color: fixedColors[1] },
      { name: "Hobby", color: fixedColors[2] },
    ];
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState<EventType | null>(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [eventCategory, setEventCategory] = useState<string>("");

  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState("");

  // 儲存到 localStorage
  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  // 新增事件
  const handleAddClick = () => {
    setModalEvent(null);
    setEventTitle("");
    setEventDate(format(new Date(), "yyyy-MM-dd"));
    setEventCategory(categories[0]?.name || "");
    setModalOpen(true);
  };

  // 點擊事件
  const handleEventClick = (clickInfo: any) => {
    setModalEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      date: clickInfo.event.startStr,
      category: clickInfo.event.extendedProps.category,
      color: clickInfo.event.backgroundColor
    });
    setEventTitle(clickInfo.event.title);
    setEventDate(clickInfo.event.startStr);
    setEventCategory(clickInfo.event.extendedProps.category || categories[0]?.name);
    setModalOpen(true);
  };

  // 儲存事件
  const handleSave = () => {
    if (!eventTitle.trim() || !eventDate) return;
    const cat = categories.find(c => c.name === eventCategory);
    const color = cat?.color || fixedColors[0];

    if (modalEvent) {
      setEvents(prev =>
        prev.map(e =>
          e.id === modalEvent.id
            ? { ...e, title: eventTitle, date: eventDate, category: eventCategory, color }
            : e
        )
      );
    } else {
      setEvents(prev => [
        ...prev,
        {
          id: String(prev.length + 1),
          title: eventTitle,
          date: eventDate,
          category: eventCategory,
          color
        }
      ]);
    }
    setModalOpen(false);
  };

  // 刪除事件
  const handleDelete = () => {
    if (!modalEvent) return;
    setEvents(prev => prev.filter(e => e.id !== modalEvent.id));
    setModalOpen(false);
  };

  // 新增分類
  const handleAddCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed || categories.find(c => c.name === trimmed)) return;

    // 選擇尚未使用的顏色
    const usedColors = categories.map(c => c.color);
    const color = fixedColors.find(c => !usedColors.includes(c)) || fixedColors[0];

    setCategories(prev => [...prev, { name: trimmed, color }]);
    setEventCategory(trimmed);
  };

  // 刪除分類
  const handleDeleteCategory = (name: string) => {
    setCategories(prev => prev.filter(c => c.name !== name));
    setEvents(prev => prev.map(e => (e.category === name ? { ...e, category: "", color: "" } : e)));
  };

  // 編輯分類名稱
  const startEditCategory = (c: CategoryType) => {
    setEditingCategory(c.name);
    setEditCategoryName(c.name);
  };

  const saveEditCategory = () => {
    if (!editingCategory) return;
    const trimmed = editCategoryName.trim();
    if (!trimmed) return;

    setCategories(prev =>
      prev.map(c =>
        c.name === editingCategory
          ? { name: trimmed, color: c.color } // 固定顏色
          : c
      )
    );

    setEvents(prev =>
      prev.map(e =>
        e.category === editingCategory
          ? { ...e, category: trimmed, color: e.color } // 固定顏色
          : e
      )
    );

    setEditingCategory(null);
  };

  return (
    <div className="calendar-container">
      <h1 className="calendar-title">📅 Calendar</h1>

      <div className="button-group">
        <button className="back-button" onClick={() => navigate("/")}>🏠 Back to Home</button>
        <button className="add-button" onClick={handleAddClick}>➕ Add Event</button>
      </div>

      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events.map(e => ({
          ...e,
          backgroundColor: e.color,
          borderColor: e.color,
          textColor: "#4B3F4D"
        }))}
        eventClick={handleEventClick}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,dayGridWeek,dayGridDay",
        }}
        dayMaxEventRows={5}
        height="auto"
      />

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{modalEvent ? "Edit Event" : "Add Event"}</h3>
            <input type="text" value={eventTitle} onChange={e => setEventTitle(e.target.value)} placeholder="Event title" />
            <input type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} />

            <select value={eventCategory} onChange={e => setEventCategory(e.target.value)}>
              {categories.map(c => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <div className="new-category">
              <input type="text" placeholder="New category" onKeyDown={e => {
                if (e.key === "Enter") {
                  handleAddCategory((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }} />
            </div>

            <div className="modal-buttons">
              <div className="left-buttons">
                {modalEvent && <button onClick={handleDelete} className="delete-btn">Delete</button>}
                <button onClick={() => setModalOpen(false)} className="cancel-btn">Cancel</button>
              </div>
              <div className="right-buttons">
                <button className="save-btn" onClick={handleSave}>Save</button>
              </div>
            </div>

            <div className="category-tags">
              {categories.map(c => (
                <span key={c.name} className="category-tag" style={{ backgroundColor: c.color }}>
                  {c.name}
                  <button className="edit-category" onClick={() => startEditCategory(c)}>✎</button>
                  <button className="delete-category" onClick={() => handleDeleteCategory(c.name)}>×</button>
                </span>
              ))}
            </div>

            {editingCategory && (
              <div className="edit-category-section">
                <input type="text" value={editCategoryName} onChange={e => setEditCategoryName(e.target.value)} />
                <button onClick={saveEditCategory}>Save</button>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;
