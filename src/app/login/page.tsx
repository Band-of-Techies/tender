"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { cookies } from "next/headers";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [showTerminateOption, setShowTerminateOption] = useState(false);  

  // Function to handle login
  const onLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await axios.post("/api/users/login", user);
      console.log(res);

      toast.success("Logged in successfully");

      if (router && router.push) {
        router.push("/");
        window.location.reload();
      } else {
        console.error("Router is not ready");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Error while logging in";

      // Check if the error message indicates an active session
      if (err.response?.status === 403 && errorMessage.includes("active session")) {
        toast.error("Active session detected. Would you like to terminate?");
        setShowTerminateOption(true); // Show the terminate option
      } else {
        toast.error(errorMessage);
      }
    }
  };

  // Function to terminate all active sessions
  const terminateSessions = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/logout/all"); 
    
      if (res.status === 200) {
        toast.success("All sessions terminated. Please try logging in again.");
        setShowTerminateOption(false); 
        await onLogin(new Event("submit") as unknown as React.FormEvent<HTMLFormElement>);
      } else {
        toast.error("Failed to terminate sessions. Try again.");
      }
    } catch (error) {
      toast.error("Error terminating sessions. Please try again.");
    }
  };

  useEffect(() => {
    if (user.email && user.password) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <img
          alt="Your Company"
          src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
          className="mx-auto h-10 w-auto"
        />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={onLogin} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                value={user.email}
                onChange={(e) =>
                  setUser({ ...user, email: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Password
              </label>
              {/* <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-indigo-600 hover:text-indigo-500"
                >
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                value={user.password}
                onChange={(e) =>
                  setUser({ ...user, password: e.target.value })
                }
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${
                buttonDisabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
              disabled={buttonDisabled}
            >
              {buttonDisabled ? "Fill all fields" : "Sign in"}
            </button>
          </div>
        </form>

        {showTerminateOption && (
          <div className="mt-4">
            <p className="text-center text-sm text-gray-500">
              There is already an active session using your account.
            </p>
            <button
              className="w-full mt-2 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
              onClick={terminateSessions}
            >
              Terminate Active Sessions
            </button>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a
            href="/signup"
            className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
          >
            Sign up here
          </a>
        </p>
      </div>
    </div>
  );
}
