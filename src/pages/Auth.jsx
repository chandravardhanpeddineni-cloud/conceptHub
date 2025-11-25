import { useState } from "react";
import { Formik, Form, Field } from "formik";
import { Link, useMatch, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../hooks";
const Auth = () => {
  const isRegistered = useMatch("/register");
  const navigate = useNavigate();
  const { login } = useAuth();

  const [error, setErrors] = useState('');
  const initialLoginDetails = { email: "", password: "" };
  const [showPassword, setShowPassword] = useState(false);
  async function submit(values, actions) {
    // console.log(values);
    const { password } = values;
    try {
      const path = isRegistered ? "register" : "login";
      if (path == "register" && password.length < 8) {
        const error = new Error();
        error.response = {
          status: 422,
          data: {
            errors: {
              body: "Password should be atleast 8 characters"
            }
          }
        }
        throw error;
      }
      const response = await axios.post(
        `https://backend-blog-28ea.onrender.com/api/users/${path}`,
        values
      );
      // console.log("register response ",response);
      const data = response?.data;
      // console.log("data",data);

      login(data);
      navigate('/');
      setErrors('');

    } catch (err) {
      // console.log("this is in auth",err);
      const { status, data } = err.response;
      console.log(data)

      if (status === 409) {
        // alert("You are already registered please login");
        setErrors("You are already registered with this email");
      }
      else if (status === 401) {
        setErrors("Incorrect Password");
      }
      else if (status === 404) {
        setErrors("Account Not found");
      }
      else if (status === 422) {
        setErrors("Password should be atleast 8 characters");
      }
      actions.setErrors(data.msg);
      // console.log(data);

    }
  }
  return (
    <div>
      <div className="mx-auto w-full mt-14">
        <div className="flex justify-center">
          <div>
            <h1 className="text-2xl font-bold text-center">
              {" "}
              Sign {isRegistered != null ? "Up" : "in"}
            </h1>
            <Link to={isRegistered != null ? "/login" : "/register"}>
              <p className="text-md text-center font-medium text-green-500">
                {isRegistered != null ? "Already have an" : "Not created"}{" "}
                account click here
              </p>
            </Link>
            {/* <h2 className="font-bold text-center">
              {credentials ? "" : "Incorrect Credentials"}
            </h2> */}

            <h2 className="font-bold text-center">
              {error === "" ? "" : error}
            </h2>

            <Formik
              initialValues={
                isRegistered
                  ? { ...initialLoginDetails, name: "" }
                  : initialLoginDetails
              }
              onSubmit={submit}
              enableReinitialize
            >
              {() => (
                <>
                  {/* <FormErrors/> */}
                  <Form>
                    <fieldset className="flex flex-col">
                      {isRegistered != null && (
                        <Field
                          type="text"
                          autoFocus
                          name="name"
                          placeholder="Your name"
                          className="border border-zinc-700 w-64 md:w-80 lg:w-96 m-3 p-4 rounded-full"
                        />
                      )}

                      <Field
                        type="email"
                        name="email"
                        autoFocus={isRegistered === null}
                        placeholder="Your email"
                        className="border border-zinc-700 w-64 md:w-80 lg:w-96 m-3 p-4 rounded-full"
                      />
                      <div className="relative m-3 w-64 md:w-80 lg:w-96">
                        <Field
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Your password"
                          className="border border-zinc-700 w-full p-4 pr-12 rounded-full"
                        />

                        <button
                          type="button"
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                          title={showPassword ? 'Hide password' : 'Show password'}
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-xl leading-none"
                        >
                          {showPassword ? '👁️' : '👁️‍🗨️'}
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="rounded-lg ml-auto bg-green-500 p-4 mt-3 mr-3"
                      >
                        Sign {isRegistered != null ? "up" : "in"}
                      </button>
                    </fieldset>
                  </Form>
                </>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
