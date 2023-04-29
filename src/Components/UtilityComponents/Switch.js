import React, {useContext} from 'react';
import "../../Styles/Switch.css";
import KanbanContext from "../UtilityComponents/KanbanContext";

const Switch = () => {
    const { kanban, setKanban } = useContext(KanbanContext);

    const toggleDarkMode = () => {
        const prevDarkMode = kanban.darkMode;
        setKanban((prevKanban) => ({
            ...prevKanban,
            darkMode: !prevDarkMode,
        })); 
    }
  return (
    <>
      <input
      checked={kanban.darkMode} onChange={() => toggleDarkMode()}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        className="react-switch-label bg-main-purple margin-left-16 margin-right-16"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button`} />
      </label>
    </>
  );
};

export default Switch;