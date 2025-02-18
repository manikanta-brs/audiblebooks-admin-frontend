import {
  useGetCategoriesQuery,
  useDeleteCategoryMutation,
  useAddCategoryMutation,
} from "../store/apiSlice";
import { useState, useEffect } from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import ReactPaginate from "react-paginate";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";

// Styled Components (same as before, keep all your existing styles)
const CategoriesPageContainer = styled(motion.div)`
  min-height: 100vh;
  padding: 2rem; /* Add padding for overall page spacing */
`;

const TableContainer = styled.div`
  overflow-x: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
`;

const StyledTable = styled.table`
  width: 100%;
  text-sm text-left text-gray-500 dark:text-gray-400;
  border-collapse: collapse;
`;

const StyledTableHeader = styled.thead`
  text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400;
`;

const StyledTableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid #d1d5db; /* border-gray-300 */
`;

const StyledTableHeaderCell = styled.th`
  padding: 1rem;
  font-weight: 600;
  border-bottom: 2px solid #9ca3af; /* border-gray-400 */
`;

const ActionButton = styled.button`
  background-color: ${(props) =>
    props.danger ? "#dc2626" : "#16a34a"}; /* Red or Green */
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: ${(props) => (props.danger ? "#b91c1c" : "#15803d")};
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const InputField = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db; /* border-gray-300 */
  border-radius: 0.375rem;
  margin-bottom: 0.75rem;
  color: #374151; /* text-gray-700 */

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* ring-blue-500 */
  }
`;

// Styles for react-paginate
const StyledReactPaginate = styled(ReactPaginate)`
  display: flex;
  justify-content: center;
  list-style: none;
  padding: 0;
  margin-top: 1rem;

  li a {
    padding: 0.5rem 1rem;
    border: 1px solid #ccc;
    cursor: pointer;
    margin: 0 0.25rem;
    border-radius: 0.375rem;
    color: #3b82f6;
    text-decoration: none;
  }

  li.previous a,
  li.next a {
    font-weight: bold;
  }

  li.active a {
    background-color: #3b82f6;
    color: white;
    border-color: #3b82f6;
  }

  li.disabled a {
    color: #aaa;
    cursor: not-allowed;
    border-color: #ddd;
  }

  li.break a {
    border: none;
    cursor: default;
  }
`;

const CategoriesPage = () => {
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);

  const { data, isLoading, isError, error } = useGetCategoriesQuery();

  const [deleteCategory, { isLoading: isDeleting }] =
    useDeleteCategoryMutation();
  const [addCategory, { isLoading: isAdding }] = useAddCategoryMutation();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryKeywords, setNewCategoryKeywords] = useState("");

  const categories = data?.categories || [];

  useEffect(() => {
    // Filter categories based on search term
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  // Calculate total and pageCount based on filteredCategories
  const total = filteredCategories.length;
  const pageCount = Math.ceil(total / itemsPerPage);

  // Pagination Logic (use filteredCategories)
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  const handlePageClick = (data) => {
    setPage(data.selected + 1);
  };

  const handleDelete = async (categoryId) => {
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
          await deleteCategory(categoryId).unwrap();
          Swal.fire("Deleted!", "The category has been deleted.", "success");
        } catch (err) {
          console.error("Failed to delete category:", err);
          toast.error("Failed to delete category.");
        }
      }
    });
  };

  const handleAddCategory = async () => {
    if (newCategoryName.trim() === "") {
      toast.error("Category name cannot be empty.");
      return;
    }

    try {
      await addCategory({
        name: newCategoryName,
        keywords: newCategoryKeywords,
      }).unwrap();
      setNewCategoryName("");
      setNewCategoryKeywords("");
      toast.success("Category added successfully!");
    } catch (err) {
      console.error("Failed to add category:", err);
      toast.error("Failed to add category.");
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (isError) return <p>Error: {error?.message}</p>;

  return (
    <CategoriesPageContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Category List
      </h2>

      {/* Search Bar */}
      <div className="mb-4">
        <label
          htmlFor="search"
          className="block text-sm font-medium text-gray-700"
        >
          Search Categories:
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
            placeholder="Search by category name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
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

      <TableContainer>
        <StyledTable>
          <StyledTableHeader>
            <tr>
              <StyledTableHeaderCell>ID</StyledTableHeaderCell>
              <StyledTableHeaderCell>Name</StyledTableHeaderCell>
              <StyledTableHeaderCell style={{ textAlign: "center" }}>
                Actions
              </StyledTableHeaderCell>
            </tr>
          </StyledTableHeader>
          <tbody>
            {paginatedCategories.map((category) => (
              <tr
                key={category._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <StyledTableCell className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {category._id}
                </StyledTableCell>
                <StyledTableCell className="px-6 text-white py-4">
                  {category.name}
                </StyledTableCell>
                <StyledTableCell className="px-6 py-4  text-center">
                  <ActionButton
                    danger
                    onClick={() => handleDelete(category._id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </ActionButton>
                </StyledTableCell>
              </tr>
            ))}

            {/* Add Category Form Row */}
            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
              <StyledTableCell></StyledTableCell>
              <StyledTableCell>
                <InputField
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="New category name"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
                <InputField
                  type="text"
                  value={newCategoryKeywords}
                  onChange={(e) => setNewCategoryKeywords(e.target.value)}
                  placeholder="New category keywords (comma separated)"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                />
              </StyledTableCell>
              <StyledTableCell className="px-6 py-4 text-center">
                <ActionButton onClick={handleAddCategory} disabled={isAdding}>
                  {isAdding ? "Adding..." : "Add"}
                </ActionButton>
              </StyledTableCell>
            </tr>
          </tbody>
        </StyledTable>
      </TableContainer>

      {/* Pagination Controls with react-paginate */}
      <StyledReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        breakClassName={"break-me"}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        subContainerClassName={"pages pagination"}
        activeClassName={"active"}
        forcePage={page - 1} // set forcePage prop
      />

      {!isLoading && categories.length === 0 && <p>No categories found.</p>}
    </CategoriesPageContainer>
  );
};

export default CategoriesPage;
