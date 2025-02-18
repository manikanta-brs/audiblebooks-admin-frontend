import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Link,
  useLocation, // Import useLocation
  Outlet, // Import Outlet
} from "react-router-dom";
import { useSelector } from "react-redux";
import LoginPage from "./pages/LoginPage";
import ProtectedRoute from "./admin/ProtectedRoutes";
import HomePage from "./pages/HomePage";
import UserList from "./pages/UserList";
import AuthorList from "./pages/AuthorsList";
import AudiobookList from "./pages/AudiobookList";
import StatisticsPage from "./pages/StatisticsPage";
import CategoriesPage from "./pages/CategoriesPage";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers,
  faBook,
  faChartBar,
  faPen,
  faTags,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Styled Components
const SidebarContainer = styled.div`
  background-color: #2d3748; /* Background color */
  color: white;
  padding: 2rem;
  min-height: 100vh;
  width: 250px; /* Fixed width */
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column; /* Ensure content stacks vertically */
`;

const SidebarLink = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  margin-bottom: 0.5rem;
  transition: background-color 0.2s ease-in-out;
  font-size: 1rem; /* Icon and text size */

  &:hover {
    background-color: #4a5568;
  }

  &.active {
    background-color: #3b82f6;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 2rem;
  background-color: #f7fafc;
  min-height: 100vh;
`;

// Layout Component (combines Sidebar and content)
const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div style={{ display: "flex" }}>
      <SidebarContainer>
        <SidebarLink to="/home" className={isActive("/home") ? "active" : ""}>
          <FontAwesomeIcon icon={faArrowLeft} /> Home
        </SidebarLink>
        <SidebarLink to="/users" className={isActive("/users") ? "active" : ""}>
          <FontAwesomeIcon icon={faUsers} /> Users
        </SidebarLink>

        <SidebarLink
          to="/audiobooks"
          className={isActive("/audiobooks") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faBook} /> Audiobooks
        </SidebarLink>

        <SidebarLink
          to="/authors"
          className={isActive("/authors") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faPen} /> Authors
        </SidebarLink>

        <SidebarLink
          to="/categories"
          className={isActive("/categories") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faTags} /> Categories
        </SidebarLink>

        <SidebarLink
          to="/statistics"
          className={isActive("/statistics") ? "active" : ""}
        >
          <FontAwesomeIcon icon={faChartBar} /> Statistics
        </SidebarLink>
      </SidebarContainer>
      <MainContent>
        <Outlet /> {/* Render the content of the active route here */}
      </MainContent>
    </div>
  );
};

function App() {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Navigate to="/home" /> : <LoginPage />,
    },
    {
      path: "/login",
      element: isLoggedIn ? <Navigate to="/home" /> : <LoginPage />,
    },
    {
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <HomePage />,
        },
        {
          element: <AdminLayout />, // Wrap all admin pages in the layout
          children: [
            {
              path: "/users",
              element: <UserList />,
            },
            {
              path: "/authors",
              element: <AuthorList />,
            },
            {
              path: "/audiobooks",
              element: <AudiobookList />,
            },
            {
              path: "/statistics",
              element: <StatisticsPage />,
            },
            {
              path: "/categories",
              element: <CategoriesPage />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
