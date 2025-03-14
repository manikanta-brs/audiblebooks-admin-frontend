import React, { useState, useEffect, useRef } from "react";
import {
  useGetAuthorsQuery,
  useUpdateAuthorsMutation,
  useDeleteAuthorMutation,
} from "../store/apiSlice";
import AuthorBooks from "./AuthorBooks";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const AuthorList = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 4;
  const [searchTerm, setSearchTerm] = useState("");
  const [showNoAuthorsMessage, setShowNoAuthorsMessage] = useState(false);

  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState(null);
  const [showAuthorBooks, setShowAuthorBooks] = useState(false);
  const booksSectionRef = useRef(null);

  const { data, isLoading, isError, error, refetch } = useGetAuthorsQuery({
    page: page,
    limit: itemsPerPage,
    searchTerm: searchTerm,
  });

  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();
  const [updateAuthors, { isLoading: isUpdating }] = useUpdateAuthorsMutation();

  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const authors = data?.authors || [];
  const totalAuthors = data?.total || 0;
  const totalPages = Math.ceil(totalAuthors / itemsPerPage);

  useEffect(() => {
    const handler = setTimeout(() => {
      refetch({ page: 1, searchTerm: searchTerm });
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, refetch]);

  useEffect(() => {
    if (!isLoading && !isError) {
      setShowNoAuthorsMessage(authors.length === 0);
    }
  }, [isLoading, isError, authors.length]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setPage(1);
    refetch({ page: 1, searchTerm: "" });
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    refetch({ page: newPage, searchTerm: searchTerm });
  };

  const handleAuthorClick = (authorId, authorName) => {
    setSelectedAuthorId(authorId);
    setSelectedAuthorName(authorName);
    setShowAuthorBooks(true);
    setTimeout(() => {
      booksSectionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 500);
  };

  const handleCloseAuthorBooks = () => {
    setShowAuthorBooks(false);
  };

  const handleDelete = async (author) => {
    Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete author: ${author.first_name} ${author.last_name} (Email: ${author.email}). You won't be able to revert this!`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await deleteAuthor(author._id).unwrap();
          setSelectedAuthorId(null);
          setShowAuthorBooks(false);
          Swal.fire("Deleted!", "The author has been deleted.", "success");
          refetch({ page: page, searchTerm: searchTerm });
        } catch (err) {
          console.error("Failed to delete author:", err);
          toast.error("Failed to delete author.");
        }
      }
    });
  };

  const handleEdit = (author) => {
    setEditingAuthorId(author._id);
    setEditedFirstName(author.first_name);
    setEditedLastName(author.last_name);
  };

  const handleCancelEdit = () => {
    setEditingAuthorId(null);
    setEditedFirstName("");
    setEditedLastName("");
  };

  const handleSaveEdit = async (authorId) => {
    try {
      await updateAuthors({
        authorId,
        first_name: editedFirstName,
        last_name: editedLastName,
      }).unwrap();
      setEditingAuthorId(null);
      setEditedFirstName("");
      setEditedLastName("");
      toast.success("Author updated successfully!");
      refetch({ page: page, searchTerm: searchTerm });
    } catch (err) {
      console.error("Failed to update author:", err);
      toast.error("Failed to update author.");
    }
  };

  if (isLoading) return <p>Loading authors...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Author List</h2>

      {/* Search Input */}
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search Authors:
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
            className="block w-full p-4 pl-10 text-sm text-white border border-gray-700 rounded-lg bg-gray-900 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearchChange}
            required
          />
          {searchTerm && (
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={handleClearSearch}
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

      {/* Table */}
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full table-auto text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-800 dark:bg-gray-900 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3 w-24 text-white">
                ID
              </th>
              <th scope="col" className="px-6 py-3 w-32 text-white">
                First Name
              </th>
              <th scope="col" className="px-6 py-3 w-32 text-white">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3 w-48 text-white">
                Email
              </th>
              <th scope="col" className="px-6 py-3 w-48 text-center text-white">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr
                key={author._id}
                className="bg-gray-900 border-b border-gray-700 hover:bg-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-300 whitespace-nowrap dark:text-white">
                  {author._id}
                </td>
                {editingAuthorId === author._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editedFirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                        className="shadow-sm bg-gray-500 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editedLastName}
                        onChange={(e) => setEditedLastName(e.target.value)}
                        className="shadow-sm bg-gray-500 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5  dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-gray-300">
                      {author.first_name}
                    </td>
                    <td className="px-6 py-4 text-gray-300">
                      {author.last_name}
                    </td>
                  </>
                )}
                <td className="px-6 py-4 text-gray-300">{author.email}</td>
                <td className="px-6 py-4 text-center">
                  {editingAuthorId === author._id ? (
                    // Edit Mode Buttons
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleSaveEdit(author._id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
                        disabled={isUpdating}
                      >
                        {isUpdating ? "Saving..." : "Save"}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    // View Mode Buttons
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(author)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          handleAuthorClick(
                            author._id,
                            author.first_name + " " + author.last_name
                          )
                        }
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        View Books
                      </button>
                      <button
                        onClick={() => handleDelete(author)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showNoAuthorsMessage && (
        <p className="text-black">
          No authors found matching the search criteria.
        </p>
      )}

      {/* Pagination */}
      <div className="flex justify-between mt-6">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-300 dark:text-gray-300">
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

      {showAuthorBooks && selectedAuthorId && (
        <div ref={booksSectionRef} className="mt-8">
          <button
            onClick={handleCloseAuthorBooks}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          >
            Close Books
          </button>
          <AuthorBooks
            authorId={selectedAuthorId}
            authorName={selectedAuthorName}
          />
        </div>
      )}
    </div>
  );
};

export default AuthorList;
