import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
      <div className="absolute inset-0 opacity-10 bg-[url('/logof.png')] bg-center bg-no-repeat bg-contain" />
      
      <div className="relative z-10">
        <h1 className="text-9xl font-cormorant text-[var(--color-gold-500)] font-bold mb-4 drop-shadow-[0_0_15px_rgba(212,175,55,0.3)]">404</h1>
        <h2 className="text-3xl md:text-4xl font-cormorant text-white mb-6">Page Not Found</h2>
        <p className="text-gray-400 font-nunito mb-8 max-w-md mx-auto">
          The frame you&apos;re looking for seems to have slipped out of focus. Let&apos;s get you back to the gallery.
        </p>
        
        <Link 
          href="/"
          className="inline-block border border-[var(--color-gold-500)] text-[var(--color-gold-500)] hover:bg-[var(--color-gold-500)] hover:text-[#0a0a0a] px-8 py-3 rounded-md font-nunito tracking-widest uppercase text-sm transition-all duration-300"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
