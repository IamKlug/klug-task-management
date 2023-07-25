import "./Styles/App.css";
import "./Styles/MediaQueries.css";
import { useState, useEffect } from "react";
import KanbanContext from "./Components/UtilityComponents/KanbanContext";
import KanbanBoard from "./Components/KanbanBoard/KanbanBoard";

function App() {
 

  
  const initialState = {
    activeBoardId: "14158122529",
    boards: {
      14158122529: {
        id: "14158122529",
        title: "Platform Launch",
        columns: [],
      },
      // boardId: { id: boardId, title: 'Board Title', columns: [columnId1, columnId2] }
    },
    columns: {
      // columnId: { id: columnId, title: 'Column Title', tasks: [taskId1, taskId2] }
    },
    tasks: {
      // taskId: { id: taskId, columnId: columnId, title: 'Task Title', description: 'Task Description' subTasks: [subTaskId1, subTaskId2] }
    },
    subTasks: {
      // subTaskId: { id: SubTaskId, checked: false content: 'SubTask Content'}
    },
    darkMode: true,
    sideNavOpen: false,
  };

  const [kanban, setKanban] = useState(()=>{
    const localData = localStorage.getItem('kanban');
    return localData ? JSON.parse(localData) : initialState;
  });

  useEffect(() => {
    localStorage.setItem('kanban', JSON.stringify(kanban));
  }, [kanban]);

  const handleResize = () => {
    if (window.innerWidth < 770 && kanban.sideNavOpen) {
      setKanban((prevKanban) => ({ ...prevKanban, sideNavOpen: false }));
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [kanban.sideNavOpen]);


  return (
    <div className="App">
      <KanbanContext.Provider value={{ kanban, setKanban }}>
        <KanbanBoard kanban={kanban} setKanban={setKanban} />
      </KanbanContext.Provider>
    </div>
  );
}

export default App;
