// src/components/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FaTachometerAlt,
  FaChartBar,
  FaUsers,
  FaUserTie,
} from 'react-icons/fa';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) return null;

  const linkBase = 'flex items-center gap-3 px-4 py-3 rounded-md hover:bg-blue-600 hover:text-white transition-all';
  const activeClass = 'bg-blue-700 text-white font-medium';
  const inactiveClass = 'text-gray-300';

  return (
    <aside className="bg-gray-900 text-white w-16 hover:w-64 transition-all duration-300 h-screen sticky top-0 z-10 flex flex-col overflow-hidden group">
      {/* Logo */}
      <div className="p-4 text-center font-bold text-xl text-blue-400 whitespace-nowrap">
        <span className="hidden group-hover:inline">WorkNext</span>
        <span className="group-hover:hidden">W</span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col space-y-2 px-2">
        <NavLink
          to={`/${user.role}`}
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaTachometerAlt />
          <span className="hidden group-hover:inline">Dashboard</span>
        </NavLink>

        {user.role === 'admin' && (
          <>
            <NavLink
              to="/reports"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <FaChartBar />
              <span className="hidden group-hover:inline">Reports</span>
            </NavLink>

            <NavLink
              to="/users"
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeClass : inactiveClass}`
              }
            >
              <FaUsers />
              <span className="hidden group-hover:inline">Manage Users</span>
            </NavLink>
          </>
        )}

        {user.role === 'manager' && (
          <NavLink
            to="/my-employees"
            className={({ isActive }) =>
              `${linkBase} ${isActive ? activeClass : inactiveClass}`
            }
          >
            <FaUserTie />
            <span className="hidden group-hover:inline">Employees</span>
          </NavLink>
        )}
      </nav>

      {/* Optional Footer */}
      <div className="mt-auto text-sm text-gray-400 text-center p-4 hidden group-hover:block">
        v1.0.0
      </div>
    </aside>
  );
};

export default Sidebar;
