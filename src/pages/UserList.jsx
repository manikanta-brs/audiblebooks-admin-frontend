// import React, { useState, useEffect, useCallback } from "react";
// import {
//   useGetUsersQuery,
//   useUpdateUsersMutation,
//   useDeleteUserMutation,
// } from "../store/apiSlice";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Swal from "sweetalert2";
// import "sweetalert2/dist/sweetalert2.min.css";

// const UserList = () => {
//   const [page, setPage] = useState(1);
//   const itemsPerPage = 5;
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredUsers, setFilteredUsers] = useState([]);

//   const { data, isLoading, isError, error } = useGetUsersQuery({ skip: false }); //Fetch data by default.

//   const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
//   const [updateUsers, { isLoading: isUpdating }] = useUpdateUsersMutation();

//   const [editingUserId, setEditingUserId] = useState(null);
//   const [editedFirstName, setEditedFirstName] = useState("");
//   const [editedLastName, setEditedLastName] = useState("");

//   const users = data?.users || [];

//   // Debounced setSearchTerm function
//   const debouncedSetSearchTerm = useCallback((value) => {
//     let timeoutId;
//     return () => {
//       clearTimeout(timeoutId);
//       timeoutId = setTimeout(() => {
//         setSearchTerm(value);
//         setPage(1);
//       }, 300); // Adjust the delay (in ms) as needed
//     };
//   }, []);

//   useEffect(() => {
//     if (data?.users) {
//       //Only filter if data is available
//       const filtered = data.users.filter(
//         (user) =>
//           user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           user.email.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//       setFilteredUsers(filtered);
//     }
//   }, [searchTerm, data]);
//   if (isLoading) return <p>Loading users...</p>;
//   if (isError) return <p>Error: {error?.message}</p>;

//   if (!Array.isArray(users) || users.length === 0) {
//     return <p>No users found.</p>;
//   }

//   const totalUsers = filteredUsers.length;
//   const totalPages = Math.ceil(totalUsers / itemsPerPage);
//   const startIndex = (page - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

//   const handlePageChange = (newPage) => {
//     setPage(newPage);
//   };

//   const handleDelete = async (userId) => {
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
//           await deleteUser(userId).unwrap();
//           Swal.fire("Deleted!", "The user has been deleted.", "success");
//         } catch (err) {
//           console.error("Failed to delete user:", err);
//           toast.error(
//             "Failed to delete user: " + (err?.message || err?.toString())
//           ); // Show more descriptive error
//         }
//       }
//     });
//   };

//   const handleEdit = (user) => {
//     setEditingUserId(user._id);
//     setEditedFirstName(user.first_name);
//     setEditedLastName(user.last_name);
//   };

//   const handleCancelEdit = () => {
//     setEditingUserId(null);
//     setEditedFirstName("");
//     setEditedLastName("");
//   };

//   const handleSaveEdit = async (user) => {
//     try {
//       await updateUsers({
//         userId: user._id, // Corrected: Use user._id
//         first_name: editedFirstName,
//         last_name: editedLastName,
//       }).unwrap();
//       setEditingUserId(null);
//       setEditedFirstName("");
//       setEditedLastName("");
//       toast.success("User updated successfully!");
//     } catch (err) {
//       console.error("Failed to update user:", err);
//       toast.error(
//         "Failed to update user: " + (err?.message || err?.toString())
//       ); // Show more descriptive error
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-2xl font-semibold mb-6 text-gray-800">User List</h2>

//       <div className="mb-4">
//         <label
//           htmlFor="search"
//           className="block text-sm font-medium text-gray-700"
//         >
//           Search Users:
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
//             onChange={(e) => {
//               debouncedSetSearchTerm(e.target.value)(); // call the debounced function
//             }}
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
//             {paginatedUsers.map((user) => (
//               <tr
//                 key={user._id}
//                 className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
//               >
//                 <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
//                   {user._id}
//                 </td>
//                 {editingUserId === user._id ? (
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
//                     <td className="px-6 py-4">{user.first_name}</td>
//                     <td className="px-6 py-4">{user.last_name}</td>
//                   </>
//                 )}
//                 <td className="px-6 py-4">{user.email}</td>
//                 <td className="px-6 py-4 text-center">
//                   {editingUserId === user._id ? (
//                     <>
//                       <button
//                         onClick={() => handleSaveEdit(user)} // Corrected: Pass the user object
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
//                         onClick={() => handleEdit(user)}
//                         className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(user._id)}
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
//           aria-label="Previous Page" // Added aria-label
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
//           aria-label="Next Page" // Added aria-label
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserList;
import React, { useState, useEffect, useCallback } from "react";
import {
  useGetUsersQuery,
  useUpdateUsersMutation,
  useDeleteUserMutation,
} from "../store/apiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

const UserList = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 5; // Moved back into the component
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]); //Unnecessary

  const { data, isLoading, isError, error } = useGetUsersQuery({
    page: page,
    limit: itemsPerPage,
  });

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [updateUsers, { isLoading: isUpdating }] = useUpdateUsersMutation();

  const [editingUserId, setEditingUserId] = useState(null);
  const [editedFirstName, setEditedFirstName] = useState("");
  const [editedLastName, setEditedLastName] = useState("");

  const users = data?.users || [];
  const totalUsers = data?.total || 0;
  const totalPages = Math.ceil(totalUsers / itemsPerPage);

  // Debounced setSearchTerm function
  const debouncedSetSearchTerm = useCallback((value) => {
    let timeoutId;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSearchTerm(value);
        setPage(1);
      }, 300); // Adjust the delay (in ms) as needed
    };
  }, []);

  useEffect(() => {
    //Since you now get ALL users from the api on each page, this filtering step is wrong
    //  if (data?.users) {
    //   //Only filter if data is available
    //   const filtered = data.users.filter(
    //     (user) =>
    //       user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //       user.email.toLowerCase().includes(searchTerm.toLowerCase())
    //   );
    //   setFilteredUsers(filtered);
    // }
  }, [searchTerm, data]);

  //   const totalUsers = filteredUsers.length; // Not needed with backend pagination
  // const totalPages = Math.ceil(totalUsers / itemsPerPage); //Handled by server
  // const startIndex = (page - 1) * itemsPerPage; //Not Needed
  // const endIndex = startIndex + itemsPerPage; //Not Needed
  // const paginatedUsers = filteredUsers.slice(startIndex, endIndex); //Not Needed

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleDelete = async (userId) => {
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
          await deleteUser(userId).unwrap();
          Swal.fire("Deleted!", "The user has been deleted.", "success");
        } catch (err) {
          console.error("Failed to delete user:", err);
          toast.error(
            "Failed to delete user: " + (err?.message || err?.toString())
          ); // Show more descriptive error
        }
      }
    });
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedFirstName(user.first_name);
    setEditedLastName(user.last_name);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditedFirstName("");
    setEditedLastName("");
  };

  const handleSaveEdit = async (user) => {
    try {
      await updateUsers({
        userId: user._id, // Corrected: Use user._id
        first_name: editedFirstName,
        last_name: editedLastName,
      }).unwrap();
      setEditingUserId(null);
      setEditedFirstName("");
      setEditedLastName("");
      toast.success("User updated successfully!");
    } catch (err) {
      console.error("Failed to update user:", err);
      toast.error(
        "Failed to update user: " + (err?.message || err?.toString())
      ); // Show more descriptive error
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  if (!Array.isArray(users) || users.length === 0) {
    return <p>No users found.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">User List</h2>

      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search Users:
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
            onChange={(e) => {
              debouncedSetSearchTerm(e.target.value)(); // call the debounced function
            }}
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
            {users.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {user._id}
                </td>
                {editingUserId === user._id ? (
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
                    <td className="px-6 py-4">{user.first_name}</td>
                    <td className="px-6 py-4">{user.last_name}</td>
                  </>
                )}
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4 text-center">
                  {editingUserId === user._id ? (
                    <>
                      <button
                        onClick={() => handleSaveEdit(user)} // Corrected: Pass the user object
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
                        onClick={() => handleEdit(user)}
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
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
          aria-label="Previous Page" // Added aria-label
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
          aria-label="Next Page" // Added aria-label
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UserList;
