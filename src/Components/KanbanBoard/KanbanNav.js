import "../../Styles/KanbanNav.css";
import "../../Styles/MediaQueries.css";
import React from "react";
import LogoMobile from "../IconComponents/LogoMobile";
import IconChevronDown from "../IconComponents/IconChevronDown";
import EditDeleteDropdown from "../Modals/EditDeleteDropdown";
import KanbanContext from "../UtilityComponents/KanbanContext";

export default function KanbanNav({
  openModal,
  closeModal,
  deleteBoard,
  ...props
}) {
  const { kanban } = React.useContext(KanbanContext);
  const activeBoardId = kanban.activeBoardId
  const noActiveColumns = kanban.boards[activeBoardId].columns.length > 0 ? false : true

const handleAddTask = () => {
  const activeBoardId = kanban.activeBoardId
  if(kanban.boards[activeBoardId].columns.length === 0){
    return null
  } else {
    closeModal();
    openModal("AddTask");
  }

}

  return (
    <nav
      className={`kanban-nav ${kanban.darkMode ? "bg-dark-gray" : "bg-white"}`}
    >
      <div className="kanban-nav_left">
        <LogoMobile />
        <h3
          className={`kanban-nav_title ${
            kanban.darkMode && "white"
          } heading-large margin-left-16`}
          onClick={() => {
            if (window.innerWidth <= 700) {
              closeModal();
              openModal("BoardNav");
            }
          }}
        >
          Platform Launch
        </h3>
        <IconChevronDown />
      </div>
      <div className="kanban-nav_right">
        <button
          className={`kanban-nav_add_task_button heading-large bg-main-purple white ${noActiveColumns && "kanban-nav_add_task_button_blur"}`}
          onClick={handleAddTask}
        >
          +<p className="heading-medium show-add-task-button"> Add New Task</p>
        </button>
        <EditDeleteDropdown
          edit={"Edit Board"}
          modalType={"EditBoard"}
          delete={"Delete Board"}
          deleteUnit={deleteBoard}
          openModal={openModal}
          closeModal={closeModal}
        />
      </div>
    </nav>
  );
}
