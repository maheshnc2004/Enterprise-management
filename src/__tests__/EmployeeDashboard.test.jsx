import React from "react";
import { render, screen } from "@testing-library/react";
import EmployeeDashboard from "../pages/dashboard/EmployeeDashboard";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store"; 
import {thunk} from "redux-thunk"; 
import "@testing-library/jest-dom";

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("EmployeeDashboard", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          name: "John Doe",
          email: "john@example.com",
          role: "employee",
        },
      },
      tasks: {
        tasks: [
          {
            id: "1",
            title: "Task 1",
            description: "Description 1",
            dueDate: new Date().toISOString().slice(0, 10),
            assignedTo: "john@example.com",
            status: "To Do",
            comments: "Needs revision",
            priority: "High",
          },
          {
            id: "2",
            title: "Task 2",
            description: "Description 2",
            dueDate: "2025-12-31",
            assignedTo: "john@example.com",
            status: "Done",
            comments: "Done and verified",
            priority: "Low",
          },
        ],
      },
    });
  });

  it("renders welcome message with employee name", () => {
    render(
      <Provider store={store}>
        <EmployeeDashboard />
      </Provider>
    );

    expect(screen.getByText(/Welcome, John Doe/i)).toBeInTheDocument();
  });

  it("renders active tasks", () => {
    render(
      <Provider store={store}>
        <EmployeeDashboard />
      </Provider>
    );

    expect(screen.getByText(/📝 Your Tasks/i)).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
    expect(screen.getByText("💾 Update Comment")).toBeInTheDocument();
  });

  it("renders completed tasks", () => {
    render(
      <Provider store={store}>
        <EmployeeDashboard />
      </Provider>
    );

    expect(screen.getByText(/✅ Completed Tasks/i)).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
    expect(screen.getByText("Description 2")).toBeInTheDocument();
  });
});
