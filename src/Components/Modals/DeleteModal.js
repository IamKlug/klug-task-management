import React from "react";

export default function DeleteModal({
  deleteTitle,
  deleteDescription,
  closeModal,
  deleteUnit,
}) {
  return (
    <div className="bg-modal">
      <div className="modal bg-white padding-24">
        <h3 className="heading-large margin-bottom-24 align-self-start red">
          {deleteTitle}
        </h3>
        <p className="body-large medium-gray margin-bottom-24">
            {deleteDescription}
        </p>
        <button
          onClick={() => {
            deleteUnit();
            closeModal();
          }}
          className="heading-medium button-primary bg-red white"
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
  );
}
