import React, { useState, useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
import IconVerticalEllipsis from "../IconComponents/IconVerticalEllipsis";
import ModalTypeContext from "../UtilityComponents/ModalTypeContext";

export default function EditDeleteDropdown(props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { kanban } = useContext(KanbanContext);
  const { modalType, setModalType } = useContext(ModalTypeContext);
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const renderDeleteButton = () => {
    if (props.modalType === "EditBoard" && Object.keys(kanban.boards).length < 2) {
      return null;
    } else {
      return (
        
        <p
         onClick={() => {
          setModalType(props.modalType);
          console.log(props.modalType)
          console.log(modalType)
          toggleDropdown();
          props.closeModal();
          props.openModal("DeleteConfirmation");
          
         }}
         className="body-large red "
       >
         {props.delete}
       </p>
      );
      
    }
  };

  
  return (
    <div
      className={`dropdown ${isDropdownOpen ? "open" : ""}`}
      onClick={toggleDropdown}
    >
      <IconVerticalEllipsis />
      <div className="dropdown-content">
        <p
          onClick={() => {
            toggleDropdown();
            props.openModal(props.modalType);
          }}
          className="body-large medium-gray"
        >
          {props.edit}
        </p>
         {renderDeleteButton()}
      </div>
    </div>
  );
}
