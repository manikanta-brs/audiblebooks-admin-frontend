import React from "react";
import { Link, useLocation } from "react-router-dom";
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

const SidebarContainer = styled.div`
  background-color: #2d3748;
  color: white;
  padding: 2rem;
  min-height: 100vh;
  width: 100%;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.2);
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

  &:hover {
    background-color: #4a5568;
  }

  svg {
    margin-right: 0.75rem;
  }

  &.active {
    background-color: #3b82f6;
  }
`;

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <SidebarContainer>
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
  );
};

export default Sidebar;
