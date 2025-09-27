import React from "react";
import { Link } from "react-router-dom";
import SEO from "../components/SEO.jsx";

function NotFound() {
  return (
    <>
      <SEO
        title="404 - Page Not Found | Murlidhar Studio"
        description="The page you are looking for doesn’t exist."
        url="/404"
        robots="noindex, nofollow"
      />
      <section className="min-h-[100svh] flex flex-col items-center justify-center text-center px-6">
        <div className="max-w-xl">
          <p className="text-sm tracking-widest text-gray-400 mb-2">ERROR 404</p>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Page not found</h1>
          <p className="text-gray-600 mb-8">
            The link you followed may be broken, or the page may have been removed.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Link
              to="/"
              className="px-6 py-3 bg-black text-white rounded-md hover:opacity-90 transition"
            >
              Go to Home
            </Link>
            <Link
              to="/contactus"
              className="px-6 py-3 border border-black rounded-md hover:bg-black hover:text-white transition"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFound;


