import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
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
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    console.log(data);
    setSubmitted(true);
  };

  async function sendContact() {
    try {
      const values = getValues();
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "R-A-Token": localStorage.getItem("token"),
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          description: values.message,
        }),
      });
      if (response.status === 201) alert("Sent contact successfully.");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="bg-gray-100 min-h-full pt-16 pb-[9.1rem]">
      <div className="max-w-screen-lg mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-8">
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-700 sm:text-4xl uppercase underline">
              Get in touch
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Fill in the form below to send us a message and we'll get back to you as soon as possible.
            </p>
            <div className="mt-8">
              <div className="mt-6">
                {!submitted ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <div className="mt-1">
                        <input
                          type="text"
                          name="name"
                          {...register("name")}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.name ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter your name"
                        />
                        {errors.name && (
                          <p className="mt-2 text-sm text-red-500">{errors.name.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email
                      </label>
                      <div className="mt-1">
                        <input
                          type="email"
                          name="email"
                          {...register("email")}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter your email"
                        />
                        {errors.email && (
                          <p className="mt-2 text-sm text-red-500">{errors.email.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                        Message
                      </label>
                      <div className="mt-1">
                        <textarea
                          name="message"
                          {...register("message")}
                          className={`appearance-none block w-full px-3 py-2 border ${
                            errors.message ? "border-red-500" : "border-gray-300"
                          } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                          placeholder="Enter your message"
                          rows="4"
                        ></textarea>
                        {errors.message && (
                          <p className="mt-2 text-sm text-red-500">{errors.message.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="mt-6">
                      <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-500 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={sendContact}
                      >
                        Send message
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center">
                    <p className="text-2xl font-bold mb-4">Thank you for your message!</p>
                    <Link
                      to="/"
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Go back to homepage
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-12 lg:mt-0">
          <iframe 
            title="map"
            width="100%" 
            height="100%" 
            frameborder="0" 
            marginheight="0" 
            marginwidth="0" 
            src="https://www.openstreetmap.org/export/embed.html?bbox=21.031608581542972%2C42.60983255301988%2C21.24567031860352%2C42.71624568510944&amp;layer=mapnik"
            style={{border: "none"}} 
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;