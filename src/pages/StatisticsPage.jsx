import React, { useState, useEffect, useRef } from "react";
import {
  useGetNumberOfUsersQuery,
  useGetNumberOfAuthorsQuery,
  useGetNumberOfAudiobooksQuery,
} from "../store/apiSlice";
import { Chart, registerables } from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import SingleDoughnutComponent from "./Doughnut";

Chart.register(...registerables);

const StatisticsPage = () => {
  const [chartType, setChartType] = useState("pie"); // Starting with pie chart to match the image
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

  const labels = ["Users", "Authors", "Audiobooks"];

  const dataValues = [
    usersCount?.numUsers || 0,
    authorsCount?.numAuthors || 0,
    audiobooksCount?.numAudiobooks || 0,
  ];

  const barChartData = {
    labels: labels,
    datasets: [
      {
        label: "Counts",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const areaChartData = {
    labels: labels,
    datasets: [
      {
        label: "Counts",
        data: dataValues,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        tension: 0.4,
      },
    ],
  };

  const pieChartData = {
    labels: labels,
    datasets: [
      {
        label: "Counts",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.8)", // Red
          "rgba(54, 162, 235, 0.8)", // Blue
          "rgba(255, 206, 86, 0.8)", // Yellow
        ],
        hoverOffset: 4,
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide legend to match image
        position: "top",
      },
    },
  };

  const pieChartOptions = {
    ...chartOptions,
    aspectRatio: 1,
    plugins: {
      legend: {
        display: false,
        position: "top",
      },
      title: {
        display: false,
        text: "Pie Chart Title",
      },
    },
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setChartType((prevChartType) => {
        switch (prevChartType) {
          case "bar":
            return "line";
          case "line":
            return "pie";
          case "pie":
            return "bar";
          default:
            return "pie"; // Starts with the Pie Chart now.
        }
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <div
            style={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Added centering styles */}
            <Bar data={barChartData} options={chartOptions} ref={chartRef} />
          </div>
        );
      case "line":
        return (
          <div
            style={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Added centering styles */}
            <Line data={areaChartData} options={chartOptions} ref={chartRef} />
          </div>
        );
      case "pie":
        return (
          <div
            style={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Added centering styles */}
            <Pie data={pieChartData} options={pieChartOptions} ref={chartRef} />
          </div>
        );
      default:
        return (
          <div
            style={{
              height: "400px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {/* Added centering styles */}
            <Bar data={barChartData} options={chartOptions} ref={chartRef} />
          </div>
        );
    }
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
          Statistics
        </h2>

        <div className="mb-4 text-center">
          <button
            onClick={() => setChartType("bar")}
            className={`mx-2 px-4 py-2 rounded-md text-white ${
              chartType === "bar"
                ? "bg-blue-600"
                : "bg-gray-400 hover:bg-blue-500"
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`mx-2 px-4 py-2 rounded-md text-white ${
              chartType === "line"
                ? "bg-blue-600"
                : "bg-gray-400 hover:bg-blue-500"
            }`}
          >
            Line Chart
          </button>
          <button
            onClick={() => setChartType("pie")}
            className={`mx-2 px-4 py-2 rounded-md text-white ${
              chartType === "pie"
                ? "bg-blue-600"
                : "bg-gray-400 hover:bg-blue-500"
            }`}
          >
            Pie Chart
          </button>
        </div>

        <div className="mb-8">{renderChart()}</div>

        {/* Move the number blocks above the charts */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-blue-800">Users</h3>
            <p className="text-2xl font-bold text-blue-600">
              {usersCount?.numUsers || 0}
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-green-800">Authors</h3>
            <p className="text-2xl font-bold text-green-600">
              {authorsCount?.numAuthors || 0}
            </p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-yellow-800">
              Audiobooks
            </h3>
            <p className="text-2xl font-bold text-yellow-600">
              {audiobooksCount?.numAudiobooks || 0}
            </p>
          </div>
        </div>
      </div>
      <SingleDoughnutComponent />
    </div>
  );
};

export default StatisticsPage;
