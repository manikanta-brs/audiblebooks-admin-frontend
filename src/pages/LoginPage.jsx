// import React, { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import { useLoginAdminMutation } from "../store/apiSlice";
// import { useDispatch } from "react-redux";
// import { login } from "../store/authSlice";
// import { useNavigate } from "react-router-dom";
// import styled from "styled-components";
// import { motion } from "framer-motion";

// // Styled Components
// const LoginPageContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   min-height: 100vh;
//   background: linear-gradient(135deg, #28313b, #485461);
//   font-family: "Arial", sans-serif;
// `;

// const LoginFormWrapper = styled(motion.div)`
//   background-color: rgba(255, 255, 255, 0.9);
//   padding: 3rem;
//   border-radius: 15px;
//   box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
//   width: 400px;
//   text-align: center;
//   backdrop-filter: blur(5px);
//   border: 1px solid rgba(255, 255, 255, 0.18);
// `;

// const StyledForm = styled(Form)`
//   display: flex;
//   flex-direction: column;
//   align-items: stretch;
// `;

// const StyledLabel = styled.label`
//   text-align: left;
//   margin-bottom: 0.5rem;
//   font-weight: 600;
//   color: #333;
// `;

// const StyledField = styled(Field)`
//   padding: 1rem;
//   margin-bottom: 1.5rem;
//   border: none;
//   border-radius: 8px;
//   background-color: #f2f2f2;
//   box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
//   transition: box-shadow 0.2s ease-in-out;

//   &:focus {
//     outline: none;
//     box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
//   }
// `;

// const StyledErrorMessage = styled.div`
//   color: #e74c3c;
//   margin-bottom: 1rem;
//   font-size: 0.9rem;
//   text-align: left;
// `;

// const StyledCheckboxLabel = styled.label`
//   display: flex;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   color: #555;
//   cursor: pointer;

//   input {
//     margin-right: 0.5rem;
//   }
// `;

// const StyledButton = styled.button`
//   background: linear-gradient(to right, #3498db, #2980b9);
//   color: white;
//   padding: 1rem 2rem;
//   border: none;
//   border-radius: 8px;
//   cursor: pointer;
//   font-size: 1.1rem;
//   font-weight: bold;
//   transition: background 0.3s ease-in-out;

//   &:hover {
//     background: linear-gradient(to right, #2980b9, #3498db);
//   }

//   &:disabled {
//     background: #bdc3c7;
//     cursor: not-allowed;
//   }
// `;

// const LoginError = styled.div`
//   color: #c0392b;
//   margin-top: 1rem;
//   font-weight: bold;
// `;

// const initialValues = {
//   email: "",
//   password: "",
//   rememberme: false,
// };

// const validationSchema = Yup.object().shape({
//   email: Yup.string().email("Invalid email").required("Email is required"),
//   password: Yup.string().required("Password is required"),
// });

// const LoginPage = () => {
//   const [loginAdmin, { isLoading }] = useLoginAdminMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [loginError, setLoginError] = useState(null);

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setLoginError(null);

//     try {
//       const response = await loginAdmin({
//         email: values.email,
//         password: values.password,
//       }).unwrap();

//       // console.log("Full Login response:", response);

//       dispatch(
//         login({
//           token: response.token,
//           isAuthorLogin: response.isAuthorLogin || false,
//           userData: response.adminUser || null,
//           profileData: response.profile || null,
//         })
//       );

//       const userData = response.adminUser || null;
//       const profileData = response.profile || null;
//       const isAuthorLogin = response.isAuthorLogin || false;

//       const storage = values.rememberme ? localStorage : sessionStorage;

//       storage.setItem("token", response.token);
//       storage.setItem("isAuthorLogin", JSON.stringify(isAuthorLogin));
//       storage.setItem("userData", JSON.stringify(userData));
//       storage.setItem("profileData", JSON.stringify(profileData));

//       navigate("/home");
//     } catch (error) {
//       console.error("Login failed", error);
//       setLoginError("Invalid credentials. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <LoginPageContainer>
//       <LoginFormWrapper
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         <h2>Admin Login</h2>
//         <Formik
//           initialValues={initialValues}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting }) => (
//             <StyledForm>
//               <StyledLabel htmlFor="email">Email</StyledLabel>
//               <StyledField type="email" id="email" name="email" />
//               <StyledErrorMessage name="email" component="div" />

//               <StyledLabel htmlFor="password">Password</StyledLabel>
//               <StyledField type="password" id="password" name="password" />
//               <StyledErrorMessage name="password" component="div" />

//               <StyledCheckboxLabel htmlFor="rememberme">
//                 <Field type="checkbox" id="rememberme" name="rememberme" />
//                 Remember Me
//               </StyledCheckboxLabel>

//               <StyledButton type="submit" disabled={isSubmitting || isLoading}>
//                 {isLoading ? "Logging in..." : "Login"}
//               </StyledButton>

//               {loginError && <LoginError>{loginError}</LoginError>}
//             </StyledForm>
//           )}
//         </Formik>
//       </LoginFormWrapper>
//     </LoginPageContainer>
//   );
// };

// export default LoginPage;

import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useLoginAdminMutation } from "../store/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/authSlice";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";

// Styled Components
const LoginPageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #28313b, #485461);
  font-family: "Arial", sans-serif;
`;

const LoginFormWrapper = styled(motion.div)`
  background-color: rgba(255, 255, 255, 0.9);
  padding: 3rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
  width: 400px;
  text-align: center;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.18);
`;

const StyledForm = styled(Form)`
  display: flex;
  flex-direction: column;
  align-items: stretch;
`;

const StyledLabel = styled.label`
  text-align: left;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
`;

const StyledField = styled(Field)`
  padding: 1rem;
  margin-bottom: 1.5rem;
  border: none;
  border-radius: 8px;
  background-color: #f2f2f2;
  box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s ease-in-out;

  &:focus {
    outline: none;
    box-shadow: inset 2px 2px 5px rgba(0, 0, 0, 0.2);
  }
`;

const StyledErrorMessage = styled.div`
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: left;
`;

const StyledCheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
  color: #555;
  cursor: pointer;

  input {
    margin-right: 0.5rem;
  }
`;

const StyledButton = styled.button`
  background: linear-gradient(to right, #3498db, #2980b9);
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  transition: background 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(to right, #2980b9, #3498db);
  }

  &:disabled {
    background: #bdc3c7;
    cursor: not-allowed;
  }
`;

const LoginError = styled.div`
  color: #c0392b;
  margin-top: 1rem;
  font-weight: bold;
`;

const initialValues = {
  email: "",
  password: "",
  rememberme: false,
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginPage = () => {
  const [loginAdmin, { isLoading }] = useLoginAdminMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState(null);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn); // Get isLoggedIn from Redux store

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home"); // Redirect if already logged in
    }
  }, [isLoggedIn, navigate]);

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoginError(null);

    try {
      const response = await loginAdmin({
        email: values.email,
        password: values.password,
      }).unwrap();

      dispatch(
        login({
          token: response.token,
          isAuthorLogin: response.isAuthorLogin || false,
          userData: response.adminUser || null,
          profileData: response.profile || null,
        })
      );

      const userData = response.adminUser || null;
      const profileData = response.profile || null;
      const isAuthorLogin = response.isAuthorLogin || false;

      const storage = values.rememberme ? localStorage : sessionStorage;

      storage.setItem("token", response.token);
      storage.setItem("isAuthorLogin", JSON.stringify(isAuthorLogin));
      storage.setItem("userData", JSON.stringify(userData));
      storage.setItem("profileData", JSON.stringify(profileData));

      navigate("/home");
    } catch (error) {
      console.error("Login failed", error);
      setLoginError("Invalid credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <LoginPageContainer>
      <LoginFormWrapper
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Admin Login</h2>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <StyledForm>
              <StyledLabel htmlFor="email">Email</StyledLabel>
              <StyledField type="email" id="email" name="email" />
              <StyledErrorMessage name="email" component="div" />

              <StyledLabel htmlFor="password">Password</StyledLabel>
              <StyledField type="password" id="password" name="password" />
              <StyledErrorMessage name="password" component="div" />

              <StyledCheckboxLabel htmlFor="rememberme">
                <Field type="checkbox" id="rememberme" name="rememberme" />
                Remember Me
              </StyledCheckboxLabel>

              <StyledButton type="submit" disabled={isSubmitting || isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </StyledButton>

              {loginError && <LoginError>{loginError}</LoginError>}
            </StyledForm>
          )}
        </Formik>
      </LoginFormWrapper>
    </LoginPageContainer>
  );
};

export default LoginPage;
