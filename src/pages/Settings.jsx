import { Field, Form, Formik } from "formik";
import React, { useState } from "react";
import { useAuth } from "../hooks";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Settings = () => {
  const { logout, authUser } = useAuth();
  const navigate = useNavigate();
  const [errors, setErrors] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSubmit = async (values, actions) => {
    try {
      const response = await axios.put("https://backend-blog-28ea.onrender.com/api/users/update", values);
      setErrors("");
      logout();
      navigate("/login");
    } catch (err) {
      const { status } = err.response;
      if (status === 401) {
        setErrors("Incorrect Password");
      }
    }
  };

  const initialValues = {
    image: "",
    name: authUser?.name || "",
    about: "",
    email: authUser?.email || "",
    oldPassword: "",
    newPassword: "",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-green-600">Your Settings</h1>
        {errors && (
          <div className="text-red-500 text-center mb-4 font-semibold">
            {errors}
          </div>
        )}
        <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
          {() => (
            <Form className="flex flex-col gap-4">
              <Field
                type="text"
                name="image"
                placeholder="URL of profile pic"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <Field
                type="text"
                name="name"
                placeholder="John"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <Field
                as="textarea"
                name="about"
                rows="4"
                placeholder="Short Bio about you"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <Field
                type="email"
                name="email"
                placeholder="John@gmail.com"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <Field
                type="password"
                name="oldPassword"
                placeholder="Old Password"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <Field
                type="password"
                name="newPassword"
                placeholder="New Password"
                className="border rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 transition-all text-white font-semibold py-3 rounded-md mt-4"
              >
                Update Settings
              </button>
            </Form>
          )}
        </Formik>

        <hr className="my-6" />

        <button
          onClick={handleLogout}
          className="w-full border border-red-400 text-red-400 hover:bg-red-50 transition-all font-semibold py-3 rounded-md"
        >
          Or click here to Logout
        </button>
      </div>
    </div>
  );
};

export default Settings;
