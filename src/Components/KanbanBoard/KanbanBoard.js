import React, { useState } from "react";
import { useModalManager } from "../UtilityComponents/useModalManager";
import ModalTypeContext from "../UtilityComponents/ModalTypeContext";
import KanbanNav from "./KanbanNav";
import KanbanBoardNav from "./KanbanBoardNav";
import AddEditModal from "../Modals/AddEditModal";
import KanbanColumn from "./KanbanColumn";
import TaskModal from "../Modals/TaskModal";
import DeleteModal from "../Modals/DeleteModal";
import KanbanBoardSideNav from "./KanbanBoardSideNav";
import IconHideSideBar from "../IconComponents/IconHideSideBar";
import IconShowSideBar from "../IconComponents/IconShowSideBar";

export default function KanbanBoard(props) {
  const { activeModal, openModal, closeModal } = useModalManager();
  const [modalType, setModalType] = useState("");
  const [activeTask, setActiveTask] = useState(null);
  const renderModal = () => {
    const task = activeTask ? props.kanban.tasks[activeTask] : null;
    const subTasks = task
      ? task.subTasks.map((subTaskId) => props.kanban.subTasks[subTaskId])
      : [];
    const taskDescription =
      activeTask && props.kanban.tasks[activeTask]
        ? props.kanban.tasks[activeTask].description
        : null;

    switch (activeModal) {
      case "BoardNav":
        return <KanbanBoardNav openModal={openModal} closeModal={closeModal} />;
      case "AddBoard":
        return (
          <AddEditModal
            title={"Add New Board"}
            inputTitle={"Board Name"}
            childInputTitle={"Board Columns"}
            addChildButton={"+ Add New Column"}
            addUnitButton={"Create New Board"}
            closeModal={closeModal}
            handleForm={(formState) => handleForm(formState)}
            inputType={"boards"}
            editMode={false}
          />
        );
      case "EditBoard":
        return (
          <AddEditModal
            title={"Edit Board"}
            inputTitle={"Board Name"}
            childInputTitle={"Board Columns"}
            addChildButton={"+ Add New Column"}
            addUnitButton={"Save Changes"}
            closeModal={closeModal}
            handleForm={(formState) => handleForm(formState)}
            inputType={"boards"}
            editMode={true}
            unitName={props.kanban.boards[props.kanban.activeBoardId].title}
            childNames={props.kanban.boards[
              props.kanban.activeBoardId
            ].columns.map((columnId) => props.kanban.columns[columnId].title)}
          />
        );
      case "AddTask":
        return (
          <AddEditModal
            title={"Add New Task"}
            inputTitle={"Title"}
            childInputTitle={"Subtasks"}
            addChildButton={"+ Add New Subtask"}
            addUnitButton={"Create Task"}
            closeModal={closeModal}
            handleForm={(formState) => handleForm(formState)}
            inputType={"tasks"}
            editMode={false}
          />
        );
      case "EditTask":
        return (
          <AddEditModal
            title={"Edit Task"}
            inputTitle={"Title"}
            childInputTitle={"Subtasks"}
            addChildButton={"+ Add New Subtask"}
            addUnitButton={"Create Task"}
            closeModal={closeModal}
            handleForm={(formState) => handleForm(formState)}
            inputType={"tasks"}
            editMode={true}
            unitName={task ? task.title : ""}
            childNames={subTasks.map((subTask) => subTask.content)}
            description={taskDescription}
            columnId={task ? task.columnId : ""}
          />
        );
      case "TaskModal":
        return (
          <TaskModal
            title={task ? task.title : ""}
            description={task ? task.description : ""}
            task={task}
            subTasks={subTasks}
            openModal={openModal}
            closeModal={closeModal}
            deleteTask={() => deleteTask(activeTask)}
          />
        );
      case "DeleteConfirmation":
        const deleteTitle =
          modalType === "EditBoard" ? "Delete Board" : "Delete Task";
        const deleteDescription =
          modalType === "EditBoard"
            ? `Are you sure you want to delete the ${
                props.kanban.boards[props.kanban.activeBoardId].title
              } board? This action will remove all columns and tasks and cannot be reversed.`
            : `Are you sure you want to delete the ${task.title} task and its subtasks? This action cannot be reversed.`;
        const deleteUnit = modalType === "EditBoard" ? deleteBoard : deleteTask;
        const activeUnit =
          modalType === "EditBoard" ? props.kanban.activeBoardId : activeTask;
        return (
          <DeleteModal
            deleteTitle={deleteTitle}
            deleteDescription={deleteDescription}
            closeModal={closeModal}
            deleteUnit={() => deleteUnit(activeUnit)}
          />
        );

      default:
        return null;
    }
  };

  /* ----LOGIC-TO-UPDATE-KANBAN-STATE-WITH-FORM-STATE-UPON-FORM-SUBMITTION--------------------------------------------------------------------------- */

  const handleForm = (formState) => {
    switch (formState.inputType) {
      case "boards":
        if (formState.editMode) {
          handleEditBoard(formState);
        } else {
          handleAddBoard(formState);
        }
        break;
      case "tasks":
        if (formState.editMode) {
          handleEditTask(formState);
        } else {
          handleAddTask(formState);
        }
        break;
      default:
        break;
    }
  };

  const handleAddBoard = (formState) => {
    const newBoardId = Date.now().toString();
    const newColumns = formState.childNames.map((title, index) => ({
      id: `${newBoardId}-${index}`,
      title: title,
      tasks: [],
    }));

    const newColumnsById = newColumns.reduce((acc, column) => {
      acc[column.id] = column;
      return acc;
    }, {});

    props.setKanban((prevKanban) => ({
      ...prevKanban,
      boards: {
        ...prevKanban.boards,
        [newBoardId]: {
          id: newBoardId,
          title: formState.unitName,
          columns: newColumns.map((column) => column.id),
        },
      },
      columns: {
        ...prevKanban.columns,
        ...newColumnsById,
      },
    }));
  };

  const handleEditBoard = (formState) => {
    const editBoardId = formState.boardId;

    props.setKanban((prevKanban) => {
      const updatedBoard = {
        ...prevKanban.boards[editBoardId],
        title: formState.unitName,
      };

      const updatedColumns = formState.childNames.map((title, index) => {
        const columnId = updatedBoard.columns[index];
        if (columnId) {
          return {
            ...prevKanban.columns[columnId],
            title: title,
          };
        } else {
          return {
            id: `${editBoardId}-${index}`,
            title: title,
            tasks: [],
          };
        }
      });

      const updatedColumnsById = updatedColumns.reduce((acc, column) => {
        acc[column.id] = column;
        return acc;
      }, {});

      // Update the columns property of the updatedBoard
      updatedBoard.columns = updatedColumns.map((column) => column.id);

      return {
        ...prevKanban,
        boards: {
          ...prevKanban.boards,
          [editBoardId]: updatedBoard,
        },
        columns: {
          ...prevKanban.columns,
          ...updatedColumnsById,
        },
      };
    });
  };

  const handleAddTask = (formState) => {
    const newTaskId = Date.now().toString();
    const columnId = formState.status;

    // Generate new subtasks
    const newSubTasks = formState.childNames.map((content, index) => ({
      id: `${newTaskId}-${index}`,
      taskId: newTaskId,
      content: content,
      completed: false, // this is new
    }));

    // Convert newSubTasks array to an object with subtask ids as keys
    const newSubTasksById = newSubTasks.reduce((acc, subTask) => {
      acc[subTask.id] = subTask;
      return acc;
    }, {});

    props.setKanban((prevKanban) => {
      const updatedTasks = {
        ...prevKanban.tasks,
        [newTaskId]: {
          id: newTaskId,
          columnId: columnId,
          title: formState.unitName,
          description: formState.description,
          subTasks: newSubTasks.map((subTask) => subTask.id),
        },
      };

      const updatedColumns = {
        ...prevKanban.columns,
        [columnId]: {
          ...prevKanban.columns[columnId],
          tasks: [...prevKanban.columns[columnId].tasks, newTaskId],
        },
      };

      return {
        ...prevKanban,
        columns: updatedColumns,
        tasks: updatedTasks,
        subTasks: {
          ...prevKanban.subTasks,
          ...newSubTasksById,
        },
      };
    });
  };

  const handleEditTask = (formState) => {
    const editTaskId = activeTask;
    const newColumnId = formState.status;

    props.setKanban((prevKanban) => {
      const originalTask = prevKanban.tasks[editTaskId];
      const originalColumnId = originalTask.columnId;
      const isColumnChanged = originalColumnId !== newColumnId;

      const updatedTask = {
        ...originalTask,
        title: formState.unitName,
        description: formState.description,
        columnId: newColumnId, // Update columnId property
      };

      const updatedSubTasks = formState.childNames.map((content, index) => {
        const subTaskId = updatedTask.subTasks[index];
        if (subTaskId) {
          return {
            ...prevKanban.subTasks[subTaskId],
            content: content,
          };
        } else {
          return {
            id: `${editTaskId}-${index}`,
            content: content,
            completed: false,
          };
        }
      });

      const updatedSubTasksById = updatedSubTasks.reduce((acc, subTask) => {
        acc[subTask.id] = subTask;
        return acc;
      }, {});

      updatedTask.subTasks = updatedSubTasks.map((subTask) => subTask.id);

      const updatedColumns = {
        ...prevKanban.columns,
      };

      if (isColumnChanged) {
        // Remove task from the original column
        updatedColumns[originalColumnId] = {
          ...prevKanban.columns[originalColumnId],
          tasks: prevKanban.columns[originalColumnId].tasks.filter(
            (taskId) => taskId !== editTaskId
          ),
        };

        // Add task to the new column
        updatedColumns[newColumnId] = {
          ...prevKanban.columns[newColumnId],
          tasks: [...prevKanban.columns[newColumnId].tasks, editTaskId],
        };
      }

      return {
        ...prevKanban,
        tasks: {
          ...prevKanban.tasks,
          [editTaskId]: updatedTask,
        },
        subTasks: {
          ...prevKanban.subTasks,
          ...updatedSubTasksById,
        },
        columns: updatedColumns,
      };
    });
  };

  /* ----END-OF-LOGIC-TO-UPDATE-KANBAN-STATE-WITH-FORM-STATE-UPON-FORM-SUBMITTION--------------------------------------------------------------------------- */

  const deleteTask = (taskId) => {
    props.setKanban((prevKanban) => {
      const taskToDelete = prevKanban.tasks[taskId];
      const columnId = taskToDelete.columnId;
      const updatedColumns = {
        ...prevKanban.columns,
        [columnId]: {
          ...prevKanban.columns[columnId],
          tasks: prevKanban.columns[columnId].tasks.filter(
            (id) => id !== taskId
          ),
        },
      };

      const updatedTasks = { ...prevKanban.tasks };
      delete updatedTasks[taskId];

      const updatedSubTasks = { ...prevKanban.subTasks };
      taskToDelete.subTasks.forEach((subTaskId) => {
        delete updatedSubTasks[subTaskId];
      });

      return {
        ...prevKanban,
        columns: updatedColumns,
        tasks: updatedTasks,
        subTasks: updatedSubTasks,
      };
    });
  };

  const deleteBoard = (boardId) => {
    const updatedActiveBoardId = Object.keys(props.kanban.boards).find(
      (id) => id !== boardId
    );

    props.setKanban((prevKanban) => {
      const boardToDelete = prevKanban.boards[boardId];

      const updatedBoards = { ...prevKanban.boards };
      delete updatedBoards[boardId];

      const updatedColumns = { ...prevKanban.columns };
      const updatedTasks = { ...prevKanban.tasks };
      const updatedSubTasks = { ...prevKanban.subTasks };

      boardToDelete.columns.forEach((columnId) => {
        const column = prevKanban.columns[columnId];

        column.tasks.forEach((taskId) => {
          const task = prevKanban.tasks[taskId];
          task.subTasks.forEach((subTaskId) => {
            delete updatedSubTasks[subTaskId];
          });

          delete updatedTasks[taskId];
        });

        delete updatedColumns[columnId];
      });

      return {
        ...prevKanban,
        activeBoardId: updatedActiveBoardId,
        boards: updatedBoards,
        columns: updatedColumns,
        tasks: updatedTasks,
        subTasks: updatedSubTasks,
      };
    });
  };

  const toggleSideNav = () => {
    props.setKanban((prevKanban) => ({
      ...prevKanban,
      sideNavOpen: !prevKanban.sideNavOpen,
    }));
  };

  return (
    <div
      className={`kanban-board-container ${
        props.kanban.darkMode ? "bg-dark" : "bg-light"
      }`}
    >
      <ModalTypeContext.Provider value={{ modalType, setModalType }}>
        <KanbanNav
          openModal={openModal}
          closeModal={closeModal}
          deleteBoard={() => deleteBoard(props.kanban.activeBoardId)}
        />

        {renderModal()}
      </ModalTypeContext.Provider>
      <div
        className={`kanban-board hide-scrollbar ${
          props.kanban.darkMode ? "bg-dark" : "bg-light"
        }`}
      >
        <KanbanBoardSideNav openModal={openModal} />
        <KanbanColumn
          openModal={openModal}
          closeModal={closeModal}
          setActiveTask={setActiveTask}
        />
        <div
          onClick={toggleSideNav}
          className={`display-sidebar-button ${
            props.kanban.sideNavOpen
              ? `${
                  props.kanban.darkMode ? "bg-dark-gray" : "bg-white"
                } margin-left-16`
              : "bg-main-purple have-shadow"
          }`}
        >
          {props.kanban.sideNavOpen ? <IconHideSideBar /> : <IconShowSideBar />}
          {props.kanban.sideNavOpen && (
            <p className="hide-shadow heading-medium medium-gray margin-left-16">
              Hide Sidebar
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
