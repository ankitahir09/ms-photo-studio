import WorkWithUsForm from "@/components/forms/WorkWithUsForm";

export const metadata = {
  title: "Work With Us | Murlidhar Studio",
  description:
    "Join our creative team of photographers, videographers, and editors at Murlidhar Studio.",
};

export default function WorkWithUsPage() {
  return (
    <div className="bg-[#f9f7f1] min-h-screen py-16">
      <div className="container mx-auto px-4 lg:px-12 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-cormorant text-gray-900 font-bold mb-4">
            Work With Us
          </h1>
          <div className="w-24 h-1 bg-(--color-gold-500) mx-auto mb-6" />
          <p className="text-gray-600 font-nunito max-w-2xl mx-auto text-lg">
            Are you passionate about visual storytelling? Join our team of
            creative professionals and help us capture timeless moments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div className="space-y-8">
            <h2 className="text-3xl font-cormorant font-bold text-gray-900">
              Why Join Us?
            </h2>
            <div className="space-y-6">
              {[
                {
                  title: "Creative Freedom",
                  desc: "We encourage innovation and unique perspectives in every shoot.",
                },
                {
                  title: "Premium Equipment",
                  desc: "Access to state-of-the-art cameras, lenses, and lighting.",
                },
                {
                  title: "Growth Opportunities",
                  desc: "Learn from experienced professionals and build a stunning portfolio.",
                },
              ].map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-8 h-8 rounded-full bg-(--color-gold-500)/20 text-(--color-gold-600) flex items-center justify-center shrink-0 mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-cormorant font-bold text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-gray-600 font-nunito mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-[#111] text-white p-8 rounded-xl shadow-lg mt-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-(--color-gold-500)/10 rounded-bl-full" />
              <h3 className="text-2xl font-cormorant font-bold mb-4">
                Current Openings
              </h3>
              <ul className="space-y-3 font-nunito text-gray-300">
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>Senior Photographer</span>
                  <span className="text-(--color-gold-500) text-sm">
                    Full Time
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>Video Editor</span>
                  <span className="text-(--color-gold-500) text-sm">
                    Full Time
                  </span>
                </li>
                <li className="flex justify-between items-center border-b border-white/10 pb-2">
                  <span>Assistant Videographer</span>
                  <span className="text-gray-400 text-sm">Freelance</span>
                </li>
              </ul>
            </div>
          </div>

          <WorkWithUsForm />
        </div>
      </div>
    </div>
  );
}
