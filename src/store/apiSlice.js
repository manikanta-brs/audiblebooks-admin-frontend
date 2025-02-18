import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout } from "./authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000",
  prepareHeaders: (headers, { getState }) => {
    headers.set("Content-Type", "application/json"); // Add Content-Type

    const token = getState().auth?.token; // Safe access with optional chaining
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result.error && result.error.status === 401) {
    // unauthorized
    api.dispatch(logout()); // Example: dispatch a logout action
    // Redirect to login page, clear credentials, etc.
  }
  return result;
};

export const apiSlice = createApi({
  reducerPath: "audiblebooks",
  baseQuery: baseQueryWithReauth, // use baseQueryWithReauth
  tagTypes: ["Admin", "User", "Author", "Audiobook", "Category"],
  endpoints: (builder) => ({
    loginAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/api/admin/login",
        method: "POST",
        body: credentials,
      }),
    }),

    registerAdmin: builder.mutation({
      query: (credentials) => ({
        url: "/api/admin/register",
        method: "POST",
        body: credentials,
      }),
    }),

    getUsers: builder.query({
      query: () => "/api/admin/userslist",
      providesTags: ["User"],
    }),
    updateUsers: builder.mutation({
      query: (userData) => ({
        url: "/api/admin/updateusers",
        method: "PUT",
        body: userData,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `/api/admin/deleteuser`,
        method: "DELETE",
        body: { userId }, // Sending ID in the body
        headers: {
          // Add content type header
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["User"],
    }),
    getAuthors: builder.query({
      query: () => "/api/admin/authorslist",
      providesTags: ["Author"],
    }),
    updateAuthors: builder.mutation({
      query: ({ authorId, ...updatedFields }) => ({
        url: "/api/admin/updateauthors",
        method: "PUT",
        body: { authorId, ...updatedFields },
        headers: {
          // Add the content type header
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Author"],
    }),
    deleteAuthor: builder.mutation({
      query: (authorId) => ({
        url: `/api/admin/deleteauthor`,
        method: "DELETE",
        body: { authorId },
        headers: {
          // Add the content type header
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Author"],
    }),

    getAudiobooks: builder.query({
      query: () => "/api/admin/audiobooks",
      providesTags: ["Audiobook"],
    }),

    deleteAudiobook: builder.mutation({
      query: (audiobookId) => ({
        url: `/api/admin/deleteaudiobook`, // No ID in the URL
        method: "DELETE",
        body: { audiobookId }, // ID in the request body
      }),
      invalidatesTags: ["Audiobook"],
    }),
    getCategories: builder.query({
      query: () => "/api/admin/categories",
      providesTags: ["Category"],
    }),

    addCategory: builder.mutation({
      query: (categoryData) => ({
        url: "/api/admin/addcategories",
        method: "POST",
        body: categoryData,
      }),
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (categoryId) => ({
        url: `/api/admin/deletecategory`,
        method: "DELETE",
        body: { categoryId }, // Send categoryId in the body
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: ["Category"],
    }),

    getNumberOfUsers: builder.query({
      query: () => "/api/admin/getuserscount",
      providesTags: ["Admin"],
    }),

    getNumberOfAuthors: builder.query({
      query: () => "/api/admin/getauthorscount",
      providesTags: ["Admin"],
    }),

    getNumberOfAudiobooks: builder.query({
      query: () => "/api/admin/getaudiobookscount",
      providesTags: ["Admin"],
    }),
    getAudiobooksofAuthor: builder.query({
      query: (authorId) => {
        return {
          url: `/api/admin/audiobooksofauthor`,
          body: { authorId: authorId },

          method: "POST",
        };
      },
      providesTags: ["Audiobook"],
    }),
  }),
});

export const {
  useLoginAdminMutation,
  useRegisterAdminMutation,
  useGetUsersQuery,
  useUpdateUsersMutation,
  useDeleteUserMutation,
  useGetAuthorsQuery,
  useUpdateAuthorsMutation,
  useDeleteAuthorMutation,
  useGetAudiobooksQuery,
  useDeleteAudiobookMutation,
  useGetCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetNumberOfUsersQuery,
  useGetNumberOfAuthorsQuery,
  useGetNumberOfAudiobooksQuery,
  useGetAudiobooksofAuthorQuery,
} = apiSlice;
