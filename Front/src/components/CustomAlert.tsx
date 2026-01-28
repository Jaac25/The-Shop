"use client";
import { ToastContainer, ToastOptions, toast } from "react-toastify";

export const CustomAlert = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={2000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export const SuccessAlert = (msg: string, options?: ToastOptions) =>
  toast.success(msg, options);
export const ErrorAlert = (msg: string, options?: ToastOptions) =>
  toast.error(msg, options);
export const WarningAlert = (msg: string, options?: ToastOptions) =>
  toast.warning(msg, options);
export const InfoAlert = (msg: string, options?: ToastOptions) =>
  toast.info(msg, options);
