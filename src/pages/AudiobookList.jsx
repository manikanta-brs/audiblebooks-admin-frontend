import React, { useState, useEffect } from "react";
import {
  useGetAudiobooksQuery,
  useDeleteAudiobookMutation,
} from "../store/apiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AudiobookList = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);

  const { data, isLoading, isError, error } = useGetAudiobooksQuery();

  const [deleteAudiobook, { isLoading: isDeleting }] =
    useDeleteAudiobookMutation();

  const audiobooks = data || []; // Ensure data is an array or null

  useEffect(() => {
    const filtered = (
      audiobooks && Array.isArray(audiobooks) ? audiobooks : []
    ).filter(
      (audiobook) =>
        audiobook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audiobook.authorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        audiobook.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredAudiobooks(filtered);
    setPage(1); // Reset page on search
  }, [searchTerm, audiobooks]);

  if (isLoading) return <p>Loading audiobooks...</p>;
  if (isError)
    return <p>Error: {error?.message || "Failed to load audiobooks"}</p>;

  if (!audiobooks || !Array.isArray(audiobooks) || audiobooks.length === 0) {
    return <p>No Audiobooks found.</p>;
  }

  const totalAudiobooks = filteredAudiobooks.length; // Use filtered length
  const totalPages = Math.ceil(totalAudiobooks / itemsPerPage);

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedAudiobooks = filteredAudiobooks.slice(startIndex, endIndex); // Paginate filtered data

  const handleDelete = async (audiobookId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAudiobook(audiobookId).unwrap();
          Swal.fire("Deleted!", "Your audiobook has been deleted.", "success");
        } catch (err) {
          console.error("Failed to delete audiobook:", err);
          toast.error("Failed to delete audiobook."); // Error toast
        }
      }
    });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Audiobook List
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search Audiobooks:
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by title, author, or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            required
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => {
                setSearchTerm("");
                setPage(1);
              }}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                ID
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Author
              </th>
              <th scope="col" className="px-6 py-3">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedAudiobooks.map((audiobook) => (
              <tr
                key={audiobook._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {audiobook._id}
                </td>
                <td className="px-6 py-4">{audiobook.title}</td>
                <td className="px-6 py-4">{audiobook.authorName}</td>
                <td className="px-6 py-4">{audiobook.category}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => handleDelete(audiobook._id)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2 disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-700 dark:text-gray-300">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default AudiobookList;
