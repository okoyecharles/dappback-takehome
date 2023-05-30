import React, { useState } from "react";
import { validateEmail, validateName, validatePassword } from "./validate";
import axios from "axios";

const BACKEND_URL = "http://localhost:4000";

const Form = ({ closeModal, setUserUpdate }) => {
  const [formState, setFormState] = useState("login");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);

  const [fields, setFields] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formState === "signup") {
      const nameError = validateName(fields.name);
      if (nameError) {
        setError(nameError);
        setLoading(false);
        return;
      }
    }

    const emailError = validateEmail(fields.email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    const passwordError = validatePassword(fields.password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    try {
      const url =
        formState === "login" ? "/api/users/login" : "/api/users/signup";
      const { data } = await axios.post(`${BACKEND_URL}${url}`, fields);

      // Save user and token to local storage
      const save = {
        user: data.user,
        token: data.token,
      };
      localStorage.setItem("dappback-user", JSON.stringify(save));
      setUserUpdate({});
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    closeModal();
  };

  return (
    <div className="modal-content text-secondary-200">
      <div className="flex justify-between">
        <h2 className="text-xl font-bold text-white">
          {formState === "login" ? "Welcome Back" : "Create Account"}
        </h2>
      </div>
      <form className="mt-4 flex flex-col gap-4">
        {error && <div className="text-red-400 text-ss">{error}</div>}
        {formState === "signup" && (
          <input
            className="rounded p-2 text-ss outline-none w-full bg-primary-300 placeholder:text-secondary-200 text-white"
            placeholder="Name"
            type="name"
            value={fields.name}
            onChange={(e) => {
              setFields({ ...fields, name: e.target.value });
            }}
          />
        )}
        <input
          className="rounded p-2 text-ss outline-none w-full bg-primary-300 placeholder:text-secondary-200 text-white"
          placeholder="Email"
          type="email"
          value={fields.email}
          onChange={(e) => {
            setFields({ ...fields, email: e.target.value });
          }}
        />
        <input
          className="rounded p-2 text-ss outline-none w-full bg-primary-300 placeholder:text-secondary-200 text-white"
          placeholder="Password"
          type="password"
          value={fields.password}
          onChange={(e) => {
            setFields({ ...fields, password: e.target.value });
          }}
        />
        <button
          onClick={submit}
          className="rounded p-2 text-ss outline-none w-full bg-secondary-100 placeholder:text-gray-700 text-black disabled:pointer-events-none disabled:opacity-50"
          disabled={loading}
          style={{
            backgroundColor: "#C3B5FD",
          }}
        >
          {formState === "login" ? "Login" : "Sign Up"}
        </button>

        <div className="flex justify-center">
          <button
            onClick={(e) => {
              e.preventDefault();
              setFormState(formState === "login" ? "signup" : "login");
            }}
            className="text-ss text-secondary-200 hover:text-white disabled:pointer-events-none disabled:opacity-50"
            disabled={loading}
          >
            {formState === "login"
              ? "Don't have an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
