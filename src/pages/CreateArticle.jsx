import axios from "axios";
import { Field, Formik, Form } from "formik";
import React, { useState } from "react";
import { useCreateArticle } from "../hooks";

const CreateArticle = () => {
  const { isCreating, createArticle } = useCreateArticle();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = { title: "", body: "" };


  const handleSubmit = (values, actions) => {
    if (!isSubmitting) {
      setIsSubmitting(true);
    }
    createArticle(values);
    setTimeout(() => {
      setIsSubmitting(false);
      actions.resetForm();
    }, 2000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4">
      <div className="w-full md:w-3/5 lg:w-2/5 bg-white rounded-2xl shadow-lg p-8">
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {() => (
            <Form className="flex flex-col gap-4">
              <Field
                type="text"
                name="title"
                placeholder="Topic Name"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400"
                required
              />
              <Field
                as="textarea"
                name="body"
                placeholder="About topic in your own way..."
                rows="6"
                className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
                required
              />
              
              <div className="flex justify-center mt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition duration-300 disabled:opacity-50"
                >
                  {isSubmitting ? "Posting..." : "Post"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateArticle;