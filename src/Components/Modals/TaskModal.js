import React, { useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
import EditDeleteDropdown from "./EditDeleteDropdown";

export default function TaskModal({ title, description, subTasks, ...props }) {
  const { kanban, setKanban } = useContext(KanbanContext);
  const activeBoard = kanban.boards[kanban.activeBoardId];
  const activeBoardColumns = activeBoard ? activeBoard.columns : [];

  const handleBackgroundClick = (e) => {
    if (e.target.className === "bg-modal") {
      props.closeModal();
    }
  };

  const handleStatusChange = (e) => {
    const newColumnId = e.target.value;
    const oldColumnId = props.task.columnId;
    const taskId = props.task.id;
    const updatedKanban = { ...kanban };

    // Remove task from the old column
    updatedKanban.columns[oldColumnId].tasks = updatedKanban.columns[
      oldColumnId
    ].tasks.filter((id) => id !== taskId);

    // Add task to the new column
    updatedKanban.columns[newColumnId].tasks.push(taskId);

    // Update the task's columnId
    updatedKanban.tasks[taskId].columnId = newColumnId;

    setKanban(updatedKanban);
  };

  const handleCheckSubtask = (subTaskId) => {
    const updatedKanban = { ...kanban };
    updatedKanban.subTasks[subTaskId].completed =
      !updatedKanban.subTasks[subTaskId].completed;
    setKanban(updatedKanban);
  };

  return (
    <div className="bg-modal" onClick={handleBackgroundClick}>
      <div
        className={`modal padding-24 ${
          kanban.darkMode ? "bg-dark-gray" : "bg-white"
        }`}
      >
        <div className="task-modal-header">
          <h3
            className={`heading-large text-align-center ${
              kanban.darkMode && "white"
            }`}
          >
            {title}
          </h3>
          <EditDeleteDropdown
            edit={"Edit Task"}
            modalType={"EditTask"}
            delete={"Delete Task"}
            deleteUnit={props.deleteTask}
            openModal={props.openModal}
            closeModal={props.closeModal}
          />
        </div>

        <h6 className="body-large medium-gray align-self-start  margin-bottom-24">
          {description}
        </h6>
        <h6 className="heading-small medium-gray align-self-start">
          0 of {subTasks.length} substasks
        </h6>

        {subTasks.map((subTask) => {
          const subTaskId = subTask.id;
          const subtaskContent = kanban.subTasks[subTaskId].content;
          const isCompleted = kanban.subTasks[subTaskId].completed;
          return (
            <label
              className={`subtask-checkbox-container ${
                kanban.darkMode ? "bg-dark white" : "bg-light"
              }`}
            >
              <input
                className="margin-left-16 margin-right-16"
                type="checkbox"
                checked={isCompleted}
                onChange={() => handleCheckSubtask(subTaskId)}
              />
              <p
                className={`heading-small ${
                  isCompleted && "strikethrough-completed"
                }`}
              >
                {subtaskContent}
              </p>
            </label>
          );
        })}
        <h6 className="heading-small medium-gray align-self-start">
          Current Status
        </h6>
        <select
          className={`status-option body-large margin-bottom-24 ${
            kanban.darkMode ? "bg-dark-gray white" : "bg-white"
          } `}
          name="status"
          value={props.task.columnId}
          onChange={handleStatusChange}
        >
          {activeBoardColumns.map((columnId) => {
            const column = kanban.columns[columnId];
            return (
              <option
                className="status-option body-large"
                key={column.id}
                value={column.id}
              >
                {column.title}
              </option>
            );
          })}
        </select>
      </div>
    </div>
  );
}
