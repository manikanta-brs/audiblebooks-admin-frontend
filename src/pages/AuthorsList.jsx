// import React, { useState, useEffect } from "react";
// import {
//   useGetAuthorsQuery,
//   useUpdateAuthorsMutation,
//   useDeleteAuthorMutation,
// } from "../store/apiSlice";
// import AuthorBooks from "./AuthorBooks";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";

// const AuthorList = () => {
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredAuthors, setFilteredAuthors] = useState([]);

//   const [selectedAuthorId, setSelectedAuthorId] = useState(null);
//   const [selectedAuthorName, setSelectedAuthorName] = useState(null);
//   const [showAuthorBooks, setShowAuthorBooks] = useState(false); // State to control visibility of AuthorBooks component

//   const { data, isLoading, isError, error } = useGetAuthorsQuery();

//   const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();
//   const [updateAuthors, { isLoading: isUpdating }] = useUpdateAuthorsMutation();

//   const [editingAuthorId, setEditingAuthorId] = useState(null);
//   const [editedFirstName, setEditedFirstName] = useState("");
//   const [editedLastName, setEditedLastName] = useState("");

//   const authors = data?.authors || [];

//   useEffect(() => {
//     const filtered = authors.filter(
//       (author) =>
//         author.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         author.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         author.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//     setFilteredAuthors(filtered);
//     setPage(1); // Reset to first page on search
//   }, [searchTerm, authors]);

//   if (isLoading) return <p>Loading authors...</p>;
//   if (isError) return <p>Error: {error?.message}</p>;

//   if (!Array.isArray(authors) || authors.length === 0) {
//     return <p>No authors found.</p>;
//   }

//   const totalAuthors = filteredAuthors.length; // Use filtered length
//   const totalPages = Math.ceil(totalAuthors / itemsPerPage);

//   const startIndex = (page - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex); // Paginate filtered authors

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleAuthorClick = (authorId, authorName) => {
//     setSelectedAuthorId(authorId);
//     setSelectedAuthorName(authorName);
//     setShowAuthorBooks(true); // Show AuthorBooks component on author click
//   };

//   const handleCloseAuthorBooks = () => {
//     setShowAuthorBooks(false); // Hide AuthorBooks component
//   };

//   const handleDelete = async (authorId) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await deleteAuthor(authorId).unwrap();
//           setSelectedAuthorId(null);
//           setShowAuthorBooks(false); // Hide AuthorBooks component if it was open
//           Swal.fire("Deleted!", "The author has been deleted.", "success");
//         } catch (err) {
//           console.error("Failed to delete author:", err);
//           toast.error("Failed to delete author.");
//         }
//       }
//     });
//   };

//   const handleEdit = (author) => {
//     setEditingAuthorId(author._id);
//     setEditedFirstName(author.first_name);
//     setEditedLastName(author.last_name);
//   };

//   const handleCancelEdit = () => {
//     setEditingAuthorId(null);
//     setEditedFirstName("");
//     setEditedLastName("");
//   };

//   const handleSaveEdit = async (authorId) => {
//     try {
//       await updateAuthors({
//         authorId,
//         first_name: editedFirstName,
//         last_name: editedLastName,
//       }).unwrap();
//       setEditingAuthorId(null);
//       setEditedFirstName("");
//       setEditedLastName("");
//       toast.success("Author updated successfully!");
//     } catch (err) {
//       console.error("Failed to update author:", err);
//       toast.error("Failed to update author.");
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">Author List</h2>

//       {/* Search Bar */}
//       <div className="mb-4">
//         <label
//           htmlFor="search"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Search Authors:
//         </label>
//         <div className="relative">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg
//               className="w-5 h-5 text-gray-500 dark:text-gray-400"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
//               />
//             </svg>
//           </div>
//           <input
//             type="text"
//             id="search"
//             className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//             placeholder="Search by name or email..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             required
//           />
//           {searchTerm && (
//             <button
//               type="button"
//               className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//               onClick={() => {
//                 setSearchTerm("");
//                 setPage(1);
//               }}
//             >
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 xmlns="http://www.w3.org/2000/svg"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth="2"
//                   d="M6 18L18 6M6 6l12 12"
//                 ></path>
//               </svg>
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="overflow-x-auto shadow-md sm:rounded-lg">
//         <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
//           <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
//             <tr>
//               <th scope="col" className="px-6 py-3">
//                 ID
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 First Name
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Last Name
//               </th>
//               <th scope="col" className="px-6 py-3">
//                 Email
//               </th>
//               <th scope="col" className="px-6 py-3 text-center">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {paginatedAuthors.map((author) => (
//               <tr
//                 key={author._id}
//                 className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
//               >
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                   {author._id}
//                 </td>
//                 {editingAuthorId === author._id ? (
//                   <>
//                     <td className="px-6 py-4">
//                       <input
//                         type="text"
//                         value={editedFirstName}
//                         onChange={(e) => setEditedFirstName(e.target.value)}
//                         className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       />
//                     </td>
//                     <td className="px-6 py-4">
//                       <input
//                         type="text"
//                         value={editedLastName}
//                         onChange={(e) => setEditedLastName(e.target.value)}
//                         className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       />
//                     </td>
//                   </>
//                 ) : (
//                   <>
//                     <td className="px-6 py-4">{author.first_name}</td>
//                     <td className="px-6 py-4">{author.last_name}</td>
//                   </>
//                 )}
//                 <td className="px-6 py-4">{author.email}</td>
//                 <td className="px-6 py-4 text-center">
//                   {editingAuthorId === author._id ? (
//                     <>
//                       <button
//                         onClick={() => handleSaveEdit(author._id)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
//                         disabled={isUpdating}
//                       >
//                         {isUpdating ? "Saving..." : "Save"}
//                       </button>
//                       <button
//                         onClick={handleCancelEdit}
//                         className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ml-2"
//                       >
//                         Cancel
//                       </button>
//                     </>
//                   ) : (
//                     <>
//                       <button
//                         onClick={() => handleEdit(author)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() =>
//                           handleAuthorClick(
//                             author._id,
//                             author.first_name + " " + author.last_name
//                           )
//                         }
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
//                       >
//                         View Books
//                       </button>
//                       <button
//                         onClick={() => handleDelete(author._id)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2 disabled:opacity-50"
//                         disabled={isDeleting}
//                       >
//                         {isDeleting ? "Deleting..." : "Delete"}
//                       </button>
//                     </>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-between mt-6">
//         <button
//           onClick={() => handlePageChange(page - 1)}
//           disabled={page === 1}
//           className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span className="text-gray-700 dark:text-gray-300">
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => handlePageChange(page + 1)}
//           disabled={page === totalPages}
//           className="bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>

//       {showAuthorBooks && selectedAuthorId && (
//         <div className="mt-8">
//           <button
//             onClick={handleCloseAuthorBooks}
//             className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
//           >
//             Close Books
//           </button>
//           <AuthorBooks
//             authorId={selectedAuthorId}
//             authorName={selectedAuthorName}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default AuthorList;
import React, { useState, useEffect } from "react";
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
  const itemsPerPage = 5; //Number of records per page.
  const [searchTerm, setSearchTerm] = useState("");
  //const [filteredAuthors, setFilteredAuthors] = useState([]); //Remove unncessary state

  const [selectedAuthorId, setSelectedAuthorId] = useState(null);
  const [selectedAuthorName, setSelectedAuthorName] = useState(null);
  const [showAuthorBooks, setShowAuthorBooks] = useState(false); // State to control visibility of AuthorBooks component

  const { data, isLoading, isError, error } = useGetAuthorsQuery({
    page: page,
    limit: itemsPerPage,
  }); // Use the page and limit

  const [deleteAuthor, { isLoading: isDeleting }] = useDeleteAuthorMutation();
  const [updateAuthors, { isLoading: isUpdating }] = useUpdateAuthorsMutation();

  const [editingAuthorId, setEditingAuthorId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const authors = data?.authors || [];
  const totalAuthors = data?.total || 0;
  const totalPages = Math.ceil(totalAuthors / itemsPerPage);

  useEffect(() => {
    //No longer filter after getting the API Data, instead, filter on the server when the time is right.
    // const filtered = authors.filter(
    //   (author) =>
    //     author.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     author.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //     author.email.toLowerCase().includes(searchTerm.toLowerCase())
    // );
    // setFilteredAuthors(filtered);
    setPage(1); // Reset to first page on search. Keep this since we are going to filter in API

    //TODO
    //Change the API to accept search term and implement the filtering there.
  }, [searchTerm]);

  if (isLoading) return <p>Loading authors...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  if (!Array.isArray(authors) || authors.length === 0) {
    return <p>No authors found.</p>;
  }

  //   const totalAuthors = filteredAuthors.length; // Use filtered length //Not Necessary
  //   const totalPages = Math.ceil(totalAuthors / itemsPerPage);

  //   const startIndex = (page - 1) * itemsPerPage;
  //   const endIndex = startIndex + itemsPerPage;
  //   const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex); // Paginate filtered authors //Not Necessary
  //const paginatedAuthors = filteredAuthors.slice(startIndex, endIndex); // Paginate filtered authors

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleAuthorClick = (authorId, authorName) => {
    setSelectedAuthorId(authorId);
    setSelectedAuthorName(authorName);
    setShowAuthorBooks(true); // Show AuthorBooks component on author click
  };

  const handleCloseAuthorBooks = () => {
    setShowAuthorBooks(false); // Hide AuthorBooks component
  };

  const handleDelete = async (authorId) => {
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
          await deleteAuthor(authorId).unwrap();
          setSelectedAuthorId(null);
          setShowAuthorBooks(false); // Hide AuthorBooks component if it was open
          Swal.fire("Deleted!", "The author has been deleted.", "success");
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
    } catch (err) {
      console.error("Failed to update author:", err);
      toast.error("Failed to update author.");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Author List</h2>

      {/* Search Bar */}
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
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search by name or email..."
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
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Email
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {authors.map((author) => (
              <tr
                key={author._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {author._id}
                </td>
                {editingAuthorId === author._id ? (
                  <>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editedFirstName}
                        onChange={(e) => setEditedFirstName(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input
                        type="text"
                        value={editedLastName}
                        onChange={(e) => setEditedLastName(e.target.value)}
                        className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      />
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4">{author.first_name}</td>
                    <td className="px-6 py-4">{author.last_name}</td>
                  </>
                )}
                <td className="px-6 py-4">{author.email}</td>
                <td className="px-6 py-4 text-center">
                  {editingAuthorId === author._id ? (
                    <>
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
                    </>
                  ) : (
                    <>
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
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ml-2"
                      >
                        View Books
                      </button>
                      <button
                        onClick={() => handleDelete(author._id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2 disabled:opacity-50"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </button>
                    </>
                  )}
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

      {showAuthorBooks && selectedAuthorId && (
        <div className="mt-8">
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
