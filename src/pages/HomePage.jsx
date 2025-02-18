import React from "react";
import {
  useGetNumberOfUsersQuery,
  useGetNumberOfAuthorsQuery,
  useGetNumberOfAudiobooksQuery,
} from "../store/apiSlice.js";
import StatisticsPage from "./StatisticsPage.jsx";
import BubbleStatisticsPage from "./BubbleStatisticsPage.jsx";
import styled from "styled-components";
import { motion } from "framer-motion";
import Sidebar from "../components/Sidebar.jsx";

// Styled Components
const HomePageContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: 1fr 4fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
`;

const MainContent = styled(motion.main)`
  padding: 2rem;
  background-color: #f3f4f6; /* bg-gray-100 */
  min-height: 500px;
`;

const Section = styled(motion.section)`
  margin-bottom: 2rem;
`;

const StatisticsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const StatisticCard = styled(motion.div)`
  background: linear-gradient(
    to right,
    ${(props) => props.fromColor},
    ${(props) => props.toColor}
  );
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.75rem; /* rounded-xl */
  padding: 1.5rem;
`;

// Framer Motion Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

const Dashboard = () => {
  const {
    data: usersData,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetNumberOfUsersQuery();
  const {
    data: authorsData,
    isLoading: authorsLoading,
    isError: authorsError,
  } = useGetNumberOfAuthorsQuery();
  const {
    data: audiobooksData,
    isLoading: audiobooksLoading,
    isError: audiobooksError,
  } = useGetNumberOfAudiobooksQuery();

  return (
    <>
      <Section>
        <motion.h2 className="text-2xl font-bold text-gray-800 mb-4">
          📊 Statistics
        </motion.h2>
        <StatisticsGrid>
          {/* Total Users */}
          <StatisticCard
            fromColor="#3b82f6"
            toColor="#4f46e5"
            variants={itemVariants}
          >
            <motion.h3 className="text-lg font-semibold">Total Users</motion.h3>
            {usersLoading ? (
              <p className="animate-pulse">Loading...</p>
            ) : usersError ? (
              <p className="text-red-300">Error fetching users</p>
            ) : (
              <motion.p className="text-3xl font-bold">
                {usersData?.numUsers}
              </motion.p>
            )}
          </StatisticCard>

          {/* Total Authors */}
          <StatisticCard
            fromColor="#10b981"
            toColor="#14b8a6"
            variants={itemVariants}
          >
            <motion.h3 className="text-lg font-semibold">
              Total Authors
            </motion.h3>
            {authorsLoading ? (
              <p className="animate-pulse">Loading...</p>
            ) : authorsError ? (
              <p className="text-red-300">Error fetching authors</p>
            ) : (
              <motion.p className="text-3xl font-bold">
                {authorsData?.numAuthors}
              </motion.p>
            )}
          </StatisticCard>

          {/* Total Audiobooks */}
          <StatisticCard
            fromColor="#8b5cf6"
            toColor="#db2777"
            variants={itemVariants}
          >
            <motion.h3 className="text-lg font-semibold">
              Total Audiobooks
            </motion.h3>
            {audiobooksLoading ? (
              <p className="animate-pulse">Loading...</p>
            ) : audiobooksError ? (
              <p className="text-red-300">Error fetching audiobooks</p>
            ) : (
              <motion.p className="text-3xl font-bold">
                {audiobooksData?.numAudiobooks}
              </motion.p>
            )}
          </StatisticCard>
        </StatisticsGrid>
      </Section>

      <StatisticsPage />

      <BubbleStatisticsPage />
    </>
  );
};

const HomePage = () => {
  return (
    <HomePageContainer
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <MainContent variants={itemVariants}>
        <Dashboard />
      </MainContent>
    </HomePageContainer>
  );
};

export default HomePage;
