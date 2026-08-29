import ContactForm from "@/components/forms/ContactForm";

export const metadata = {
  title: "Contact Us | Murlidhar Studio",
  description:
    "Get in touch with Murlidhar Studio in Bhuj, Kutch. Book your photography or videography session today.",
};

export default function ContactUsPage() {
  return (
    <div className="bg-[#f9f7f1] min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-cormorant text-gray-900 font-bold mb-4">
            Contact Us
          </h1>
          <div className="w-24 h-1 bg-(--color-gold-500) mx-auto mb-6" />
          <p className="text-gray-600 font-nunito max-w-2xl mx-auto text-lg">
            We would love to hear from you! Whether you want to book a session,
            ask a question, or simply say hello.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map and Details */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-(--color-gold-500)/10 text-(--color-gold-600) rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-cormorant font-bold text-gray-900">
                  Our Studio
                </h3>
                <p className="text-gray-600 font-nunito mt-1">
                  413/D, Old Lakda Bazar,
                  <br />
                  Laxmi Tokiz to Khatri bazar Road, Nr. Ganga Naka, Anjar, Gujarat 370110
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex items-start gap-4">
              <div className="w-12 h-12 bg-(--color-gold-500)/10 text-(--color-gold-600) rounded-full flex items-center justify-center shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-cormorant font-bold text-gray-900">
                  Call Us
                </h3>
                <p className="text-gray-600 font-nunito mt-1">
                  +91 9979912805
                  <br />
                  murlidharstudio28@gmail.com
                </p>
              </div>
            </div>

            <div className="h-[300px] rounded-xl overflow-hidden shadow-lg border border-gray-100 relative grayscale hover:grayscale-0 transition-all duration-500">
              {/* Replace with actual map embed */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117565.65406080352!2d69.58498418047976!3d23.25056770246283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39511e403d523bf1%3A0x6e9f16c2718e2448!2sBhuj%2C%20Gujarat!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Murlidhar Studio Location"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
