import React, { useEffect, useState } from "react";
import {
  useGetAudiobooksofAuthorQuery,
  useDeleteAudiobookMutation,
} from "../store/apiSlice";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AuthorBooks = ({ authorId, authorName }) => {
  const {
    data: audiobooks,
    isLoading,
    isError,
    error,
  } = useGetAudiobooksofAuthorQuery(authorId);

  const [deleteAudiobook, { isLoading: isDeleting }] =
    useDeleteAudiobookMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAudiobooks, setFilteredAudiobooks] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5); // Initially show 5 books

  useEffect(() => {
    // console.log(`Audiobooks for author ${authorId}:`, audiobooks);
  }, [audiobooks, authorId]);

  useEffect(() => {
    if (audiobooks) {
      setFilteredAudiobooks(audiobooks);
      setVisibleCount(5); // Reset it to 5 when the initial data or the author ID changes
    }
  }, [audiobooks]);

  useEffect(() => {
    if (audiobooks) {
      const results = audiobooks.filter((audiobook) =>
        audiobook.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAudiobooks(results);
    }
  }, [searchTerm, audiobooks]);

  if (isLoading) return <p>Loading audiobooks...</p>;
  if (isError)
    return <p>Error: {error?.message || "Failed to load audiobooks"}</p>;

  if (!audiobooks || !Array.isArray(audiobooks)) {
    return <p>No audiobooks found for this author.</p>;
  }

  const handleDelete = async (audiobook) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete the audiobook "${audiobook.title}" by ${authorName}. This action cannot be reverted!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAudiobook(audiobook._id).unwrap();
          Swal.fire("Deleted!", "The audiobook has been deleted.", "success");
          // Optionally, you could refetch the data after deletion or update the UI locally
        } catch (err) {
          console.error("Failed to delete audiobook:", err);
          Swal.fire("Error!", "Failed to delete the audiobook.", "error");
        }
      }
    });
  };

  const handleShowMore = () => {
    setVisibleCount((prevCount) => prevCount + 5); // Increment by 5
  };

  const displayedAudiobooks = filteredAudiobooks.slice(0, visibleCount);

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Audiobooks by this Author: {authorName}
      </h3>

      {/* Search Bar */}
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Search Books by this Author
        </label>
        <input
          type="search"
          className="bg-black w-full text-white p-2 rounded-md"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <table className="table-auto w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Title</th>
            <th className="px-4 py-2">Category</th>
            <th className="px-4 py-2">Description</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedAudiobooks.length === 0 && searchTerm !== "" ? (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                No audiobooks found matching your search.
              </td>
            </tr>
          ) : displayedAudiobooks.length === 0 ? (
            <tr>
              <td colSpan="4" className="border px-4 py-2 text-center">
                No audiobooks found for this author.
              </td>
            </tr>
          ) : (
            displayedAudiobooks.map((audiobook) => (
              <tr key={audiobook._id} className="hover:bg-gray-100">
                <td className="border px-4 py-2">{audiobook.title}</td>
                <td className="border px-4 py-2">{audiobook.category}</td>
                <td className="border px-4 py-2">{audiobook.description}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDelete(audiobook)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {filteredAudiobooks.length > visibleCount && (
        <div className="text-center mt-4">
          <button
            onClick={handleShowMore}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Show More
          </button>
        </div>
      )}
    </div>
  );
};

export default AuthorBooks;
