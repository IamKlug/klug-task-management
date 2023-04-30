import React, {useContext} from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
export default function DeleteModal({
  deleteTitle,
  deleteDescription,
  closeModal,
  deleteUnit,
}) {
  const { kanban } = useContext(KanbanContext); 
  return (
    <div className="bg-modal">
      <div className={`modal padding-24 ${kanban.darkMode ? "bg-dark" : "bg-white"} `}>
        <h3 className="heading-large margin-bottom-24 align-self-start red">
          {deleteTitle}
        </h3>
        <p className="body-large medium-gray margin-bottom-24">
            {deleteDescription}
        </p>
        <div className="delete-modal_button_group">
        <button
          onClick={() => {
            deleteUnit();
            closeModal();
          }}
          className="heading-medium button-primary bg-red white margin-bottom-16"
        >
          Delete
        </button>
        <button
          className="heading-medium button-primary bg-light main-purple"
          onClick={closeModal}
        >
          Cancel
        </button>
        </div>
      </div>
    </div>
  );
}
