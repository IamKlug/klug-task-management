import { createContext } from "react";

const ModalTypeContext = createContext({
  modalType: "",
  setModalType: () => {},
});

export default ModalTypeContext;