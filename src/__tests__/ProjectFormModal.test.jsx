import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProjectFormModal from "../../src/components/projects/ProjectFormModal";
import { useDispatch, useSelector } from "react-redux";
import "@testing-library/jest-dom";
import { addNotification } from "../../src/redux/slices/notificationSlice";
jest.mock('../../src/redux/slices/notificationSlice', () => ({
  addNotification: jest.fn((payload) => ({
    type: 'notifications/addNotification',
    payload,
  })),
}));


jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
}));

const mockDispatch = jest.fn();

beforeEach(() => {
  useDispatch.mockReturnValue(mockDispatch);
  useSelector.mockImplementation((selectorFn) =>
    selectorFn({
      users: {
        users: [
          { id: 1, email: "manager1@example.com", role: "manager" },
          { id: 2, email: "employee1@example.com", role: "employee" },
        ],
      },
    })
  );
});

afterEach(() => {
  jest.clearAllMocks();
});

const mockClose = jest.fn();

describe("ProjectFormModal", () => {
  it("renders create form correctly", () => {
    render(<ProjectFormModal isEdit={false} onClose={mockClose} />);

    expect(screen.getByText("New Project")).toBeInTheDocument();
    expect(screen.getByText("Create")).toBeInTheDocument();
    expect(screen.getByText("Select Manager")).toBeInTheDocument();
  });

  it("renders edit form with default values", () => {
    const defaultValues = {
      id: 10,
      name: "Test Project",
      manager: "manager1@example.com",
      status: "Ongoing",
    };

    render(
      <ProjectFormModal
        isEdit={true}
        defaultValues={defaultValues}
        onClose={mockClose}
      />
    );

    expect(screen.getByDisplayValue("Test Project")).toBeInTheDocument();
    expect(screen.getByText("Edit Project")).toBeInTheDocument();
    expect(screen.getByText("Update")).toBeInTheDocument();
  });

  it("submits new project form", async () => {
    render(<ProjectFormModal isEdit={false} onClose={mockClose} />);

    fireEvent.change(screen.getByLabelText(/Project Name/i), {
      target: { value: "Build CRM" },
    });
    fireEvent.change(screen.getByLabelText(/Manager/i), {
      target: { value: "manager1@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Status/i), {
      target: { value: "Pending" },
    });

    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("projects/addProject"),
        })
      );
    });
  });

  it("submits updated project and sends notifications if completed", async () => {
    const defaultValues = {
      id: 11,
      name: "Complete Docs",
      manager: "manager1@example.com",
      status: "Completed",
    };

    render(
      <ProjectFormModal
        isEdit={true}
        defaultValues={defaultValues}
        onClose={mockClose}
      />
    );

    fireEvent.click(screen.getByText("Update"));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: expect.stringContaining("projects/updateProject"),
        })
      );

      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          payload: expect.objectContaining({
            message: expect.stringContaining("Project 'Complete Docs'"),
          }),
        })
      );
    });
  });

  it("shows validation errors on empty submit", async () => {
    render(<ProjectFormModal isEdit={false} onClose={mockClose} />);
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => {
      expect(screen.getByText("Project name is required")).toBeInTheDocument();
      expect(screen.getByText("Manager email is required")).toBeInTheDocument();
      expect(screen.getByText("Status is required")).toBeInTheDocument();
    });
  });
});
