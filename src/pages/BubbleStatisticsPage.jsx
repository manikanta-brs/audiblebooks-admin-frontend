import React from "react";
import {
  useGetNumberOfUsersQuery,
  useGetNumberOfAuthorsQuery,
  useGetNumberOfAudiobooksQuery,
} from "../store/apiSlice";
import { Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
import { Bubble } from "react-chartjs-2"; // Import Bubble

Chart.register(...registerables);

const BubbleStatisticsPage = () => {
  const chartRef = useRef(null);
  const {
    data: usersCount,
    isLoading: usersLoading,
    isError: usersError,
  } = useGetNumberOfUsersQuery();
  const {
    data: authorsCount,
    isLoading: authorsLoading,
    isError: authorsError,
  } = useGetNumberOfAuthorsQuery();
  const {
    data: audiobooksCount,
    isLoading: audiobooksLoading,
    isError: audiobooksError,
  } = useGetNumberOfAudiobooksQuery();

  // Prepare bubble chart data
  const bubbleChartData = {
    datasets: [
      {
        label: "Users",
        data: [
          {
            x: 1, // X-coordinate
            y: 1, // Y-coordinate
            r: Math.sqrt(usersCount?.numUsers || 1), // Radius (size) scaled to user count. Min radius = 1
          },
        ],
        backgroundColor: "rgba(255, 99, 132, 0.6)", // Customize colors
      },
      {
        label: "Authors",
        data: [
          {
            x: 2,
            y: 2,
            r: Math.sqrt(authorsCount?.numAuthors || 1), //radius scaled to author count
          },
        ],
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
      {
        label: "Audiobooks",
        data: [
          {
            x: 3,
            y: 3,
            r: Math.sqrt(audiobooksCount?.numAudiobooks || 1), // radius scaled to audiobooks count
          },
        ],
        backgroundColor: "rgba(255, 206, 86, 0.6)",
      },
    ],
  };

  const bubbleChartOptions = {
    scales: {
      x: {
        beginAtZero: true,
        max: 4, // Adjust the maximum value to control the chart's range
        title: {
          display: true,
          text: "Categories",
        },
        ticks: {
          stepSize: 1,
          callback: function (value, index, values) {
            const labels = ["", "Users", "Authors", "Audiobooks"];
            return labels[value];
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 4, // Adjust the maximum value to control the chart's range
        title: {
          display: true,
          text: "Counts",
        },
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += "Count: " + Math.pow(context.parsed.r, 2); // approximate
            }
            return label;
          },
        },
      },
    },
  };

  if (usersLoading || authorsLoading || audiobooksLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold">Loading statistics...</p>
      </div>
    );

  if (usersError || authorsError || audiobooksError)
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">
          Error loading statistics.
        </p>
      </div>
    );

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Bubble Chart Statistics
        </h2>
        <div className="w-full h-96">
          <Bubble
            data={bubbleChartData}
            options={bubbleChartOptions}
            ref={chartRef}
          />
        </div>
      </div>
    </div>
  );
};

export default BubbleStatisticsPage;
