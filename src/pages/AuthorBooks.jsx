import React, { useEffect } from "react";
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

  useEffect(() => {
    console.log(`Audiobooks for author ${authorId}:`, audiobooks);
  }, [audiobooks, authorId]);

  if (isLoading) return <p>Loading audiobooks...</p>;
  if (isError)
    return <p>Error: {error?.message || "Failed to load audiobooks"}</p>;

  if (!audiobooks || !Array.isArray(audiobooks) || audiobooks.length === 0) {
    return <p>No audiobooks found for this author.</p>;
  }

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
          Swal.fire("Deleted!", "The audiobook has been deleted.", "success");
          // Optionally, you could refetch the data after deletion or update the UI locally
        } catch (err) {
          console.error("Failed to delete audiobook:", err);
          Swal.fire("Error!", "Failed to delete the audiobook.", "error");
        }
      }
    });
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">
        Audiobooks by this Author: {authorName}
      </h3>
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
          {audiobooks.map((audiobook) => (
            <tr key={audiobook._id} className="hover:bg-gray-100">
              <td className="border px-4 py-2">{audiobook.title}</td>
              <td className="border px-4 py-2">{audiobook.category}</td>
              <td className="border px-4 py-2">{audiobook.description}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(audiobook._id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
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
  );
};

export default AuthorBooks;
