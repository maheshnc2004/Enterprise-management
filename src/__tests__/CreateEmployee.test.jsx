import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CreateEmployee from "../pages/AssignTaskToEmployee";
import { Provider } from "react-redux";
import configureMockStore from "redux-mock-store";
import {thunk} from "redux-thunk";
import "@testing-library/jest-dom";


jest.mock("../components/EmployeeTaskBoard", () => () => (
  <div>Mocked EmployeeTaskBoard</div>
));

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe("CreateEmployee Page", () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      auth: {
        user: {
          name: "Manager One",
          email: "manager1@example.com",
        },
      },
      projects: {
        projects: [
          { id: 1, name: "Project Alpha", manager: "manager1@example.com" },
          { id: 2, name: "Project Beta", manager: "manager2@example.com" }, 
        ],
      },
    });
  });

  it("renders heading and project dropdown", () => {
    render(
      <Provider store={store}>
        <CreateEmployee />
      </Provider>
    );

    expect(
      screen.getByText(/🧑‍💼 My Employees - Project Tasks/i)
    ).toBeInTheDocument();

    expect(screen.getByText("-- Select Project --")).toBeInTheDocument();
    expect(screen.getByText("Project Alpha")).toBeInTheDocument();
    expect(screen.queryByText("Project Beta")).not.toBeInTheDocument(); 
  });

  it("shows message when no project is selected", () => {
    render(
      <Provider store={store}>
        <CreateEmployee />
      </Provider>
    );

    expect(
      screen.getByText(/Please select a project to view assigned employee tasks/i)
    ).toBeInTheDocument();
  });

  it("shows EmployeeTaskBoard when a project is selected", () => {
    render(
      <Provider store={store}>
        <CreateEmployee />
      </Provider>
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "1" },
    });

    expect(screen.getByText("Mocked EmployeeTaskBoard")).toBeInTheDocument();
  });
});
