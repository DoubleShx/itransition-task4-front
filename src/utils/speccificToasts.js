import { toast } from "react-toastify";

export const notifyError = (message, bg="red", autoClose=3000) =>
toast(message, { autoClose, pauseOnHover: false, className: `bg-${bg}-toastify` });

export const notifySuccess = (message, bg="green") =>
toast(message, { autoClose: 3000, pauseOnHover: false, className: `bg-${bg}-toastify` });