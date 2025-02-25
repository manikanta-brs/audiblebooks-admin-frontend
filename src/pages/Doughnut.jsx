import React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  useGetNumberOfUsersQuery,
  useGetNumberOfAuthorsQuery,
  useGetNumberOfAudiobooksQuery,
} from "../store/apiSlice.js";

const SingleDoughnutComponent = () => {
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

  if (usersLoading || authorsLoading || audiobooksLoading) {
    return <p className="text-center text-gray-500 mt-6">Loading data...</p>;
  }

  if (usersError || authorsError || audiobooksError) {
    return <p className="text-center text-red-500 mt-6">Error loading data.</p>;
  }

  const numUsers = usersData?.numUsers || 0;
  const numAuthors = authorsData?.numAuthors || 0;
  const numAudiobooks = audiobooksData?.numAudiobooks || 0;

  const data = {
    labels: ["Users", "Authors", "Audiobooks"],
    datasets: [
      {
        label: "Counts",
        data: [numUsers, numAuthors, numAudiobooks],
        backgroundColor: [
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="flex justify-center items-center mt-6">
      <div className="w-[400px] h-[400px] bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-shadow duration-300">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  );
};

export default SingleDoughnutComponent;
