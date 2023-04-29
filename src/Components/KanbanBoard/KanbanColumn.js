import React from "react";
import { useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
import TaskList from "../TaskManagement/TaskList";

export default function KanbanColumn({ openModal, setActiveTask }) {
  const { kanban } = useContext(KanbanContext);

  const addColumns = () => {
    return (
      <div className="flex-center">
        <div>
          <p className="heading-large medium-gray">
            This board is empty. Create a new column to get started.
          </p>
          <button
            className="heading-medium button-primary bg-main-purple white"
            onClick={() => openModal("EditBoard")}
          >
            + Add New Column
          </button>
        </div>
      </div>
    );
  };

  const displayColumns = () => {
    const activeBoard = kanban.boards[kanban.activeBoardId];
    const columnsOfActiveBoard = activeBoard.columns.map(
      (columnId) => kanban.columns[columnId]
    );

    return columnsOfActiveBoard.map((column) => (
      <div key={column.id} className="column-container margin-left-16">
        <div className="column-title-container">
          <p className="column-bubble bg-teal"></p>
          <p className="heading-small letter-spacing text-transform-uppercase medium-gray margin-left-16">
            {column.title} {"("}
            {column.tasks.length}
            {")"}
          </p>
        </div>
        <TaskList columnID={column.id} setActiveTask={setActiveTask} openModal={openModal}  />
      </div>
    ));
  };

  return (
    <>
      {displayColumns()}
      {addColumns()}
    </>
  );
}
