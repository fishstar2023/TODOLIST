// src/components/FatLossTrackerPage.tsx
import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./FatLossTrackerPage.css";
import { DateSelectArg } from "@fullcalendar/core";

interface RecordItem {
  id: number;
  date: string; // yyyy-mm-dd
  weight: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  workout: string;
}

const FatLossTrackerPage: React.FC = () => {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formValues, setFormValues] = useState({
    weight: "",
    breakfast: "",
    lunch: "",
    dinner: "",
    workout: "",
  });

  // ✅ 載入 localStorage
  useEffect(() => {
    const stored = localStorage.getItem("fatloss-records");
    if (stored) {
      setRecords(JSON.parse(stored));
    }
  }, []);

  // ✅ 存入 localStorage
  useEffect(() => {
    localStorage.setItem("fatloss-records", JSON.stringify(records));
  }, [records]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const dateStr = selectInfo.startStr;
    setSelectedDate(dateStr);

    const existing = records.find((r) => r.date === dateStr);
    if (existing) {
      setFormValues({
        weight: existing.weight,
        breakfast: existing.breakfast,
        lunch: existing.lunch,
        dinner: existing.dinner,
        workout: existing.workout,
      });
    } else {
      setFormValues({
        weight: "",
        breakfast: "",
        lunch: "",
        dinner: "",
        workout: "",
      });
    }

    setFormVisible(true);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!selectedDate) return;
    const existingIndex = records.findIndex((r) => r.date === selectedDate);
    if (existingIndex >= 0) {
      const newRecords = [...records];
      newRecords[existingIndex] = {
        ...newRecords[existingIndex],
        ...formValues,
      };
      setRecords(newRecords);
    } else {
      setRecords((prev) => [
        { id: Date.now(), date: selectedDate, ...formValues },
        ...prev,
      ]);
    }
    setFormVisible(false);
  };

  const handleDelete = () => {
    if (!selectedDate) return;
    setRecords((prev) => prev.filter((r) => r.date !== selectedDate));
    setFormVisible(false);
  };

  return (
    <>
      <div className="fatloss-header">
        <h1>Fat Loss Tracker</h1>
      </div>
      <div className="fatloss-container">
        {/* 左側: 建議 */}
        <div className="fatloss-left">
          <h2>Daily Nutrition Principles</h2>
          <ul>
            <li>Total Calories: 1400–1500 kcal</li>
            <li>Protein: 110–140 g/day</li>
            <li>Carbs: 120–150 g/day</li>
            <li>Fat: 30–40 g/day</li>
            <li>Water: 1.5–2 L/day</li>
            <li>Vegetables: at least half a bowl per meal</li>
          </ul>

          <h2>Weekly Workout Plan</h2>
          <ul>
            <li>Mon: Strength (legs/back/core) 45–60 min</li>
            <li>Tue: Cardio 30–40 min</li>
            <li>Wed: Strength (chest/shoulders/arms/core) 45–60 min</li>
            <li>Thu: Cardio 30 min + Core</li>
            <li>Fri: Full-body circuit 45 min</li>
            <li>Sat: HIIT / Interval Run 20–30 min</li>
            <li>Sun: Light walk 30 min or stretching</li>
          </ul>
        </div>

        {/* 右側: 日曆 + 表單 */}
        <div className="fatloss-right">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            selectable
            select={handleDateSelect}
            events={records.map((r) => ({
              title: r.weight ? `${r.weight} kg` : "Record",
              start: r.date,
              allDay: true,
              backgroundColor: "#f4a261",
              extendedProps: {
                breakfast: r.breakfast,
                lunch: r.lunch,
                dinner: r.dinner,
                workout: r.workout,
              },
            }))}
            eventDidMount={(info) => {
              const props = info.event.extendedProps;
              const tooltip = document.createElement("div");
              tooltip.className = "custom-tooltip";
              tooltip.innerHTML = `
                <strong>${info.event.title}</strong><br/>
                🍳 Breakfast: ${props.breakfast || "-"}<br/>
                🍱 Lunch: ${props.lunch || "-"}<br/>
                🍲 Dinner: ${props.dinner || "-"}<br/>
                🏋️ Workout: ${props.workout || "-"}
              `;
              info.el.setAttribute("title", tooltip.innerText);
            }}
          />

          {formVisible && (
            <div className="fatloss-form">
              <div className="fatloss-form-header">
                <h3>{selectedDate}</h3>
                <button
                  className="close-btn"
                  onClick={() => setFormVisible(false)}
                >
                  ✕
                </button>
              </div>
              <label>
                Weight (kg):
                <input
                  name="weight"
                  value={formValues.weight}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Breakfast:
                <textarea
                  name="breakfast"
                  value={formValues.breakfast}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lunch:
                <textarea
                  name="lunch"
                  value={formValues.lunch}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Dinner:
                <textarea
                  name="dinner"
                  value={formValues.dinner}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Workout:
                <textarea
                  name="workout"
                  value={formValues.workout}
                  onChange={handleInputChange}
                />
              </label>
              <div className="fatloss-form-buttons">
                <button className="save-btn" onClick={handleSave}>
                  Save
                </button>
                <button className="delete-btn" onClick={handleDelete}>
                  Delete
                </button>
                <button className="cancel-btn" onClick={() => setFormVisible(false)}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FatLossTrackerPage;
