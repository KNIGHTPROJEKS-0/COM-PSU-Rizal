import StunningAiLoader from "./stunning-ai-loader"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-black text-white overflow-hidden">
      <h1 className="sr-only">COM Loading Animation</h1>
      <div className="mb-8 flex items-center justify-center">
        <img src="/psu-logo.svg" alt="PSU Logo" className="w-24 h-24 opacity-90" />
      </div>
      <StunningAiLoader />
      <p className="mt-8 text-center text-lg max-w-md p-6 rounded-2xl bg-gray-900 bg-opacity-30 backdrop-blur-xl border border-orange-800/30 shadow-2xl font-sans leading-7 tracking-wider text-orange-400 bg-gradient-to-br from-orange-500/10 to-amber-500/10">
        {"Collaboration Online Meet (COM) – PSU: Connecting students and teachers, anytime, anywhere."}
      </p>
    </main>
  )
}
