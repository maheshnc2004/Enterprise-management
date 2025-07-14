export function initializeAdmin() {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const adminExists = users.some(u => u.role === "admin");
  if (!adminExists) {
    users.push({
      id: Date.now().toString(),
      name: "Admin",
      email: "admin@example.com",
      password: "admin123",
      role: "admin",
    });
    localStorage.setItem("users", JSON.stringify(users));
  }
}
