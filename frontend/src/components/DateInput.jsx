import { useState, useRef, useEffect } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";
import SelectInput from "./SelectInput";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const CustomDateSelector = ({ month, onMonthChange }) => {
  const years = [];
  for (let i = 2010; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }

  const handleMonthChange = (e) => {
    const newMonth = new Date(month);
    newMonth.setMonth(Number(e.target.value));
    onMonthChange(newMonth);
  };

  const handleYearChange = (e) => {
    const newMonth = new Date(month);
    newMonth.setFullYear(Number(e.target.value));
    onMonthChange(newMonth);
  };

  return (
    <div className="flex justify-center gap-4">
      <div className="w-30">
        <SelectInput
          value={month.getMonth()}
          colorizeOnActive={false}
          onChange={handleMonthChange}
          placeholder="Month"
          options={months.map((m, idx) => ({ value: idx, label: m }))}
        />
      </div>
      <div>
        <SelectInput
          value={month.getFullYear()}
          colorizeOnActive={false}
          onChange={handleYearChange}
          placeholder="Year"
          options={years.map((y) => ({ value: y, label: y }))}
        />
      </div>
    </div>
  );
};

const DateInput = ({ value, onChange, placeholder = "Select date" }) => {
  const [selected, setSelected] = useState(value ? new Date(value) : null);
  const [month, setMonth] = useState(value ? new Date(value) : new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!value) {
      setSelected(null);
      setMonth(new Date());
    }
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (date) => {
    setSelected(date);
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    onChange && onChange(utcDate?.toISOString().slice(0, 10));
    setOpen(false);
  };

  const defaultClassNames = getDefaultClassNames();
  return (
    <div ref={ref} className="relative w-fit">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-fit cursor-pointer text-left px-3 py-2 rounded-lg border focus:ring-2
          ${
            selected
              ? "bg-[#295ba2] text-white"
              : "bg-white border-gray-300 text-gray-700"
          }`}
      >
        {selected ? selected.toLocaleDateString("es-ES") : placeholder}
      </button>

      {open && (
        <div className="absolute z-10 mt-2 bg-white rounded-xl border border-[#DBDBDB] shadow-lg p-3">
          <CustomDateSelector month={month} onMonthChange={setMonth} />
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={handleSelect}
            month={month}
            onMonthChange={setMonth}
            showOutsideDays
            hideWeekdays
            classNames={{
              selected: `bg-[#295ba2] text-white`,
              root: `${defaultClassNames.root} p-1`,
              day: `rounded-full hover:bg-[#e3ebf6] ${defaultClassNames.day}`,
              today: `text-black`,
              caption_label: `hidden`,
              chevron: "fill-[#737373]",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default DateInput;
