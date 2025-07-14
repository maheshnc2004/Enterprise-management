// src/__tests__/Login.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";
import authReducer from "../redux/slices/authSlice";
import userReducer from "../redux/slices/userSlice";
import Login from "../pages/auth/Login";
import toast from "react-hot-toast";

// ✅ Mock toast
jest.mock("react-hot-toast", () => ({
  success: jest.fn(),
  error: jest.fn(),
}));

function renderWithProviders(ui, { preloadedState, store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
  },
  preloadedState,
}), ...renderOptions } = {}) {
  function Wrapper({ children }) {
    return (
      <Provider store={store}>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    );
  }

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders login form inputs and button", () => {
    renderWithProviders(<Login />);
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  test("shows validation errors on empty submit", async () => {
    renderWithProviders(<Login />);
    fireEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(await screen.findAllByText(/is required/i)).toHaveLength(2);
  });

  test("shows error toast on invalid credentials", async () => {
    // Add a valid user so that wrong credentials are actually wrong
    localStorage.setItem("users", JSON.stringify([
      { email: "valid@example.com", password: "valid123", role: "employee" },
    ]));

    renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  test("logs in successfully with employee credentials", async () => {
    const employee = {
      email: "emp@example.com",
      password: "emp123",
      role: "employee",
      id: "emp1",
      name: "Employee One",
    };
    localStorage.setItem("users", JSON.stringify([employee]));

    const { store } = renderWithProviders(<Login />);
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: employee.email },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: employee.password },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      const authState = store.getState().auth;
      expect(authState.user.email).toBe(employee.email);
      expect(toast.success).toHaveBeenCalledWith("Logged in successfully!");
    });

    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    expect(storedUser.email).toBe(employee.email);
  });
});
