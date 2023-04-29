import React, { useState, useContext } from "react";
import KanbanContext from "../UtilityComponents/KanbanContext";
import IconCross from "../IconComponents/IconCross";

export default function AddEditModal({
  title,
  inputTitle,
  inputType,
  childInputTitle,
  addChildButton,
  addUnitButton,
  handleForm,
  editMode,
  unitName,
  childNames,
  description,
  columnId,
  ...props
}) {
  const { kanban } = useContext(KanbanContext);

  const handleBackgroundClick = (e) => {
    if (e.target.className === "bg-modal") {
      props.closeModal();
    }
  };

  const activeBoard = kanban.boards[kanban.activeBoardId];
  const activeBoardColumns = activeBoard ? activeBoard.columns : [];
  /* ------FORM-STATE-AND-LOGIC---------------------------------------------------------------------- */
  const [formState, setFormState] = useState({
    unitName: editMode ? unitName : "",
    description: editMode ? description : "",
    childNames: editMode ? childNames : [""],
    status: editMode ? columnId : activeBoardColumns[0],
    inputType: inputType,
    editMode: editMode,
    boardId: kanban.activeBoardId,
  });

  const handleInputChange = (field, value, index) => {
    const updatedFormState = { ...formState };

    if (field === "unitName") {
      updatedFormState.unitName = value;
    } else if (field === "description") {
      updatedFormState.description = value;
    } else if (field === "childNames") {
      updatedFormState.childNames[index] = value;
    } else if (field === "status") {
      updatedFormState.status = value;
    }

    setFormState(updatedFormState);
  };

  const handleAddChildUnit = (e) => {
    e.preventDefault();
    setFormState((prevFormState) => ({
      ...prevFormState,
      childNames: [...prevFormState.childNames, ""],
    }));
  };

  const handleDeleteChildUnit = (indexToDelete) => {
    setFormState((prevFormState) => ({
      ...prevFormState,
      childNames: prevFormState.childNames.filter(
        (_, index) => index !== indexToDelete
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleForm(formState);
    props.closeModal();
  };

  /* ------END-OF-FORM-STATE-AND-LOGIC-------------------------------------------------------------------- */

  return (
    <div className="bg-modal" onClick={handleBackgroundClick}>
      <form
        className={`modal ${
          kanban.darkMode ? "bg-dark-gray" : "bg-white"
        } padding-24`}
        onSubmit={handleSubmit}
      >
        <h3
          className={`heading-large margin-bottom-24 align-self-start ${
            kanban.darkMode && "white"
          }`}
        >
          {title}
        </h3>

        <h6 className="heading-small medium-gray align-self-start">
          {inputTitle}
        </h6>
        <input
          className={`text-input body-large margin-bottom-24 ${
            kanban.darkMode && "bg-dark-gray white"
          }`}
          type="text"
          value={formState.unitName}
          onChange={(e) => handleInputChange("unitName", e.target.value, null)}
        />

        {formState.inputType === "tasks" && (
          <>
            <h6 className="heading-small medium-gray align-self-start">
              Description
            </h6>
            <textarea
              className={`text-input-description body-large margin-bottom-24 ${
                kanban.darkMode && "bg-dark-gray white"
              }`}
              name="description"
              value={formState.description}
              onChange={(e) =>
                handleInputChange("description", e.target.value, null)
              }
            />
          </>
        )}

        <h6 className="heading-small medium-gray align-self-start">
          {childInputTitle}
        </h6>
        {formState.childNames.map((childName, index) => (
          <div className="flex align-self-start margin-bottom-24" key={index}>
            {/* ... */}
            <input
              className={`text-input-child body-large ${
                kanban.darkMode && "bg-dark-gray white"
              }`}
              type="text"
              value={childName}
              onChange={(e) =>
                handleInputChange("childNames", e.target.value, index)
              }
            />
            <div onClick={() => handleDeleteChildUnit(index)}>
              <IconCross />
            </div>
          </div>
        ))}
        <button
          className="heading-medium button-primary bg-light main-purple margin-bottom-24"
          onClick={handleAddChildUnit}
        >
          {addChildButton}
        </button>
        {formState.inputType === "tasks" && (
          <>
            <h6 className="heading-small medium-gray align-self-start">
              Status
            </h6>
            <select
              className={`status-option body-large margin-bottom-24 ${
                kanban.darkMode && "bg-dark-gray white"
              }`}
              name="status"
              value={formState.status}
              onChange={(e) =>
                handleInputChange("status", e.target.value, null)
              }
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
          </>
        )}

        <button
          className="heading-medium button-primary bg-main-purple white"
          type="submit"
        >
          {addUnitButton}
        </button>
      </form>
    </div>
  );
}
