import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required(),
  message: yup.string().required(),
});

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    setSubmitted(true);
  };

  return (
    <div id="Contact" className="bg-gradient-to-b from-blue-900 to-blue-600 text-white w-full h-screen flex justify-center items-center">
      <div className="max-w-screen-lg p-4 mx-auto w-full">
        <div className="pb-8 text-center">
          <p className="text-4xl font-bold inline border-b-4 border-white shadow-md hover:cursor-pointer">Contact</p>
        </div>
        <div>
          {!submitted ? (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-100 text-sm font-medium mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  {...register("name")}
                  className={`border-gray-500 bg-transparent border-b-2 focus:outline-none focus:border-b-4 w-full text-xl pb-1 ${errors.name ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your name"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-100 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  {...register("email")}
                  className={`border-gray-100 bg-transparent border-b-2 focus:outline-none focus:border-b-4 w-full text-xl pb-1 ${errors.email ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your email"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-gray-100 text-sm font-medium mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  {...register("message")}
                  className={`border-gray-500 bg-transparent border-b-2 focus:outline-none focus:border-b-4 w-full text-xl pb-1 ${errors.message ? "border-red-500" : ""
                    }`}
                  placeholder="Enter your message"
                  rows="6"
                ></textarea>
                {errors.message && (
                  <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
                )}
              </div>
              <button
                type="submit"
                className="bg-white text-blue-900 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-150focus:outline-none"
              >
                Submit
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-2xl font-bold mb-4">Thank you for your message!</p>
              <Link to="/" className="bg-white text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-colors duration-150 focus:outline-none">
                Go back to homepage
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;