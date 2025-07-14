// Polyfill for Node.js (needed for React Router in some setups)
import { TextEncoder, TextDecoder } from "util";
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import {thunk} from "redux-thunk";

import UserTable from "../components/users/UserTable";
import usersReducer  from "../redux/slices/userSlice";

// Dummy data for testing
const mockUsers = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "admin" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "manager" },
];

const renderWithStore = (onEdit = jest.fn()) => {
const store = configureStore({
  reducer: {
    users: usersReducer,
  },
    preloadedState: {
      users: {
        users: mockUsers,
      },
    },
  });

  const utils = render(
    <Provider store={store}>
      <UserTable onEdit={onEdit} />
    </Provider>
  );

  return { ...utils, store, onEdit };
};

describe("UserTable Component", () => {
  test("renders user table with rows", () => {
    renderWithStore();

    expect(screen.getByText("All Users")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    expect(screen.getAllByText("Edit").length).toBe(2);
    expect(screen.getAllByText("Delete").length).toBe(2);
  });

  test("calls onEdit when Edit button is clicked", () => {
    const { onEdit } = renderWithStore();
    const editButtons = screen.getAllByText("Edit");

    fireEvent.click(editButtons[0]);
    expect(onEdit).toHaveBeenCalledWith(mockUsers[0]);
  });

  test("dispatches deleteUser when Delete button is clicked", () => {
    const { store } = renderWithStore();
    const deleteButtons = screen.getAllByText("Delete");

    fireEvent.click(deleteButtons[1]);

    const finalState = store.getState().users.users;
    expect(finalState.length).toBe(1);
    expect(finalState.find((u) => u.id === 2)).toBeUndefined();
  });

  test("renders fallback when no users found", () => {
    const store = configureStore({
      reducer: {
        users: usersReducer,
      },
      preloadedState: {
        users: {
          users: [],
        },
      },
    });

    render(
      <Provider store={store}>
        <UserTable onEdit={jest.fn()} />
      </Provider>
    );

    expect(screen.getByText("No users found")).toBeInTheDocument();
  });
});
