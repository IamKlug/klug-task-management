import "../../Styles/Switch.css";
import "../../Styles/KanbanBoardNav.css";
import React from "react";
import { useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
import IconBoardNav from "../IconComponents/IconBoardNav";
import IconLightTheme from "../IconComponents/IconLightTheme";
import IconDarkTheme from "../IconComponents/IconDarkTheme";
import Switch from "../UtilityComponents/Switch";

export default function KanbanBoardNav({ openModal}) {
  const { kanban, setKanban } = useContext(KanbanContext);
 
  const handleButtonClick = (e) => {
    e.preventDefault();
    openModal("AddBoard");
  };

  const changeBoard = (boardId) => {
    setKanban((prevKanban) => ({
      ...prevKanban,
      activeBoardId: boardId,
    }));
  };

  return (
      <nav className={`kanban-board-nav_sidebar ${kanban.sideNavOpen ? "display-sidebar": "hide"} ${kanban.darkMode ? "bg-dark-gray" : "bg-white"}`}>
        <div className={`kanban-board-nav_modal_button_group ${kanban.darkMode && "bg-dark-gray"}`}>
          <h6 className="heading-small letter-spacing medium-gray margin-left-16 margin-bottom-24">
            ALL BOARDS ({Object.keys(kanban.boards).length})
          </h6>
          {Object.values(kanban.boards).map((board) => (
            <button
              key={board.id}
              className={`kanban-board-nav_modal_button heading-medium ${kanban.activeBoardId === board.id ?"white bg-main-purple" : "medium-gray"} ${kanban.darkMode ? "bg-dark-gray" : "bg-white"}`}
              onClick={() => {
                changeBoard(board.id);
              }}
            >
              <IconBoardNav />
              {board.title}
            </button>
          ))}
          <button
            className={`kanban-board-nav_modal_button heading-medium main-purple ${kanban.darkMode ? "bg-dark-gray" : "bg-white"} margin-bottom-24`}
            onClick={handleButtonClick}
          >
            <IconBoardNav />+ Create New Board
          </button>
        </div>
        <div className={`dark-mode-switch-container margin-bottom-24 ${kanban.darkMode ? "bg-dark" : "bg-light"}`}>
          <IconLightTheme />
          <Switch />
          <IconDarkTheme />
        </div>
      </nav>
  );
}
