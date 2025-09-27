import { useRef } from "react";
import emailjs from "@emailjs/browser";
import SlideIn from "./Animate";
import React,{useState} from "react";

function WorkWus() {
  const form = useRef();
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const sendEmail = (e) => {
  e.preventDefault();
  setLoading(true);
  setStatus({ message: "", type: "" });

  const messageValue = form.current.message?.value.trim();
  const detailsValue = form.current.details?.value.trim();
  const portfolioValue = form.current.portfolio?.value.trim();

  const formData = {
    name: form.current.name.value,
    email: form.current.email.value,
    contact: form.current.contact?.value || "",
    details: detailsValue ? `Details: ${detailsValue}` : "",
    portfolio: portfolioValue ? `Portfolio: ${portfolioValue}` : ""
  };

  emailjs
    .send("service_uhvb9oi", "template_xrp80aa", formData, "C5WyoZ-AeJW9dH323")
    .then(() => {
      setStatus({ message: "Message sent successfully!", type: "success" });
      form.current.reset();
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
      setStatus({
        message: "Failed to send message, please try again.",
        type: "error",
      });
      setTimeout(() => setStatus({ message: "", type: "" }), 5000);
    })
    .finally(() => setLoading(false));
};


  return (
<div className="px-6 md:px-10 py-16 md:py-10 min-h-[100svh]">
  <SlideIn
        direction="left"
        className="">
  <h2 className="text-2xl md:text-3xl mb-2 text-[#C5A880] nunito-sans">
    WORK WITH US
  </h2>
 
  <p className="text-gray-600 text-lg mb-6 cormorant">
    We're always excited to connect with talented individuals and creative studios in the fields of photography and filmmaking.
If you're looking to collaborate or join hands with us on meaningful projects, we'd love to hear from you.
Please fill out the form below with your details and portfolio links. If your profile aligns with any upcoming opportunities, we'll be in touch.
  </p>

 
    {/* Contact Form */}
    <form
      ref={form}
      onSubmit={sendEmail}
      className="w-full max-w-2xl space-y-4 taviraj-regular text-sm"
    >
      {/* Name and Contact side by side */}
      <div className="flex flex-col md:flex-row gap-4 leading-none">
        <input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="input w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
        />
        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          required
          className="input w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
        />
      </div>

      {/* Email field */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="input w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
      />

      {/* Message textarea */}
      <textarea
        name="details"
        placeholder="Tell us about yourself"
        required
        className="textarea w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
      ></textarea>

            <textarea
        name="portfolio"
        placeholder="Link to your portfolio (if applicable)"
        className="textarea w-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
      ></textarea>

      {/* Submit Button */}
          <div className="flex flex-row items-center gap-4">
          <button
          type="submit"
          disabled={loading}
          className={`btn px-4 py-3 nunito-sans font-medium ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#C5A880] text-white"
          }`}
        >
          {loading ? "Sending..." : "Submit"}
        </button>

        <p
  className={`text-md nunito-sans font-medium min-w-[250px] transition-opacity duration-300 ${
    status.type === "success"
      ? "text-green-600 opacity-100"
      : status.type === "error"
      ? "text-red-600 opacity-100"
      : "opacity-0"
  }`}
  aria-live="polite"
>
  {status.message}
</p>

        </div>
    </form>
     </SlideIn>
</div>

  );
}

export default WorkWus;
