import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import SlideIn from "./Animate";

function ContactUs() {
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
    message: messageValue ? `Message: ${messageValue}` : "",
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
        CONTACT US
      </h2>
      
      <p className="text-gray-600 text-lg mb-6 cormorant">
        Share your thoughts with us — we&#8217;ll get back to you shortly.
      </p>

      <div className="flex flex-col md:flex-row items-center justify-center gap-10 min-h-[60svh]">
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
              className="input w-full md:w-1/2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
            />
            <input
              type="tel"
              name="contact"
              placeholder="Contact Number"
              required
              className="input w-full md:w-1/2 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C5A880] focus:border-transparent shadow-sm"
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
            name="message"
            placeholder="Message"
            required
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
          {loading ? "Sending..." : "SEND"}
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

        {/* Map */}
        <div className="w-full min-h-[50svh] mx-auto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1297.3684386816994!2d70.02839410429024!3d23.11495040737681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3950c7a71fd3f767%3A0xf468931c90f24af9!2sMURLIDHAR%20STUDIO!5e0!3m2!1sen!2sin!4v1753938443021!5m2!1sen!2sin"
            className="w-full shadow-md min-h-[50svh]"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      </SlideIn>
    </div>
  );
}

export default ContactUs;
