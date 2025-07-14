// src/pages/auth/Login.jsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { login } from "../../redux/slices/authSlice";
import { setUsers } from "../../redux/slices/userSlice";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    let users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.some(u => u.role === "admin");
    if (!adminExists) {
      const admin = {
        id: Date.now().toString(),
        name: "Admin",
        email: "admin@example.com",
        password: "admin123",
        role: "admin"
      };
      users.push(admin);
      localStorage.setItem("users", JSON.stringify(users));
    }

    dispatch(setUsers(users));
  }, [dispatch]);

  const onSubmit = (data) => {
    const { email, password } = data;
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
      toast.error("Invalid credentials");
      return;
    }

    dispatch(login(user));
    localStorage.setItem("currentUser", JSON.stringify(user));

    toast.success("Welcome to WorkNext 👋");
    navigate(`/${user.role}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-2xl p-10 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-blue-600 tracking-wide">WorkNext</h1>
          <p className="text-sm text-gray-500 mt-1">Your work. Organized.</p>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            type="email"
            placeholder="you@example.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            {...register("password", {
              required: "Password is required",
              minLength: { value: 4, message: "Minimum 4 characters" },
            })}
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200"
        >
          Sign In
        </button>

        <p className="text-center text-gray-400 text-xs mt-6">© 2025 WorkNext. All rights reserved.</p>
      </form>
    </div>
  );
}
