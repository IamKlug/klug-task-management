import React from "react";
import { useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";

export default function TaskList({ columnID, openModal, setActiveTask }) {
  const { kanban } = useContext(KanbanContext);

  const taskCards = () => {
    const thisColumn = kanban.columns[columnID];
    const tasksOfThisColumn = thisColumn.tasks.map(
      (taskId) => kanban.tasks[taskId]
    );

    return tasksOfThisColumn.map((task) => (
      <div
        onClick={() => {
          setActiveTask(task.id);
          openModal("TaskModal");
        }}
        key={task.id}
        className={`task-list-card ${kanban.darkMode ? "bg-dark-gray white" : "bg-white" }`}
      >
        <h6 className="heading-medium">{task.title}</h6>
        <p className="body-medium medium-gray">
          0 of {task.subTasks.length} substasks
        </p>
      </div>
    ));
  };

  return taskCards();
}
