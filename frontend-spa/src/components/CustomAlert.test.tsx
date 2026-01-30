import { toast } from "react-toastify";
import {
  CustomAlert,
  SuccessAlert,
  ErrorAlert,
  WarningAlert,
  InfoAlert,
} from "./CustomAlert";
import { render, screen } from "@testing-library/react";

jest.mock("react-toastify", () => ({
  ToastContainer: () => <div data-testid="toast-container" />,
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
  },
}));

describe("CustomAlert", () => {
  it("renders the ToastContainer", () => {
    render(<CustomAlert />);
    expect(screen.getByTestId("toast-container")).toBeInTheDocument();
  });

  it("calls toast.success with correct message", () => {
    SuccessAlert("Success!");
    expect(toast.success).toHaveBeenCalledWith("Success!", undefined);
  });

  it("calls toast.error with correct message", () => {
    ErrorAlert("Error!");
    expect(toast.error).toHaveBeenCalledWith("Error!", undefined);
  });

  it("calls toast.warning with correct message", () => {
    WarningAlert("Warning!");
    expect(toast.warning).toHaveBeenCalledWith("Warning!", undefined);
  });

  it("calls toast.info with correct message", () => {
    InfoAlert("Info!");
    expect(toast.info).toHaveBeenCalledWith("Info!", undefined);
  });

  it("passes options if provided", () => {
    const options = { autoClose: 5000 };
    SuccessAlert("Custom", options);
    expect(toast.success).toHaveBeenCalledWith("Custom", options);
  });
});
