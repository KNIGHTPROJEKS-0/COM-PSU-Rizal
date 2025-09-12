import { Button } from "@/components/ui/button";
import Image from "next/image";
import LazyVideo from "./lazy-video";

export function Hero() {
  const buttonNew = (
    <Button
      asChild
      className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-6 text-white hover:from-orange-600 hover:to-orange-700"
    >
      <a href="/meeting/new">Start a Meeting</a>
    </Button>
  );

  return (
    <section className="relative isolate overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center py-14 sm:py-20">
          <div className="mb-5 flex items-center gap-3">
            <Image
              src="/icons/com-psu-rizal-white.svg"
              alt="COM-PSU-Rizal logo"
              width={48}
              height={48}
              className="h-12 w-12"
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold text-white">
                Collaboration Online Meet
              </p>
              <p className="text-xs uppercase tracking-widest text-orange-400">
                COM|PSU|Rizal
              </p>
            </div>
          </div>
          <h1 className="mt-3 text-center text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            <span className="block">COM: CONNECTING</span>
            <span className="block">
              <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(255,100,0,0.35)]">
                STUDENTS
              </span>{" "}
              AND{" "}
              <span className="text-orange-400 drop-shadow-[0_0_20px_rgba(255,100,0,0.35)]">
                TEACHERS
              </span>
            </span>
            <span className="block">ANYTIME, ANYWHERE</span>
          </h1>
          <p className="mt-4 max-w-xl text-center text-lg text-gray-300">
            Experience collaborative video conferencing solution built for
            academic communities. It enables students and instructors to connect
            virtually through video, chat, and file sharing. With features like
            attendance tracking, grade monitoring, file backup, and flexible
            scheduling, COM ensures that learning continues smoothly, safely,
            and inclusively—helping students and teachers stay engaged anytime,
            anywhere.
          </p>
          <div className="mt-6">{buttonNew}</div>

          {/* Phone grid mimic */}
          <div className="mt-10 grid w-full gap-4 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {phoneData.map((p, i) => {
              const visibility =
                i <= 2
                  ? "block"
                  : i === 3
                    ? "hidden md:block"
                    : i === 4
                      ? "hidden xl:block"
                      : "hidden";

              return (
                <div key={i} className={visibility}>
                  <PhoneCard
                    title={p.title}
                    sub={p.sub}
                    tone={p.tone}
                    gradient={p.gradient}
                    videoSrc={p.videoSrc}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneCard({
  title = "8°",
  sub = "Clear night. Great for render farm runs.",
  tone = "calm",
  gradient = "from-[#0f172a] via-[#14532d] to-[#052e16]",
  videoSrc,
}: {
  title?: string;
  sub?: string;
  tone?: string;
  gradient?: string;
  videoSrc?: string;
}) {
  return (
    <div className="relative rounded-[28px] glass-border bg-neutral-900 p-2">
      <div className="relative aspect-[9/19] w-full overflow-hidden rounded-2xl bg-black">
        <LazyVideo
          src={
            videoSrc ??
            "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/b0f3222371106db366a14ca1c29cef55-1b1EWVSa4w3FL2zslcaCGYTy9vcxjF.mp4"
          }
          className="absolute inset-0 h-full w-full object-cover"
          autoplay={true}
          loop={true}
          muted={true}
          playsInline={true}
          aria-label={`${title} - ${sub}`}
        />

        <div className="relative z-10 p-3">
          <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-white/20" />
          <div className="space-y-1 px-1">
            <div className="text-3xl font-bold leading-snug text-white/90">
              {title}
            </div>
            <p className="text-xs text-white/70">{sub}</p>
            <div className="mt-3 inline-flex items-center rounded-full bg-black/40 px-2 py-0.5 text-[10px] uppercase tracking-wider text-orange-400">
              {tone === "calm" ? "Collaboration Online Meet app" : tone}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const phoneData = [
  {
    title: "Collaboration",
    sub: "Collaborative video conferencing solution built for academic communities.",
    tone: "results",
    gradient: "from-[#0b0b0b] via-[#0f172a] to-[#020617]",
    videoSrc: "/media/collaboration.mp4",
  },
  {
    title: "Tracking",
    sub: "Helping students and teachers stay engaged anytime, anywhere.",
    tone: "speed",
    gradient: "from-[#0b1a0b] via-[#052e16] to-[#022c22]",
    videoSrc: "/media/tracking.mp4",
  },
  {
    title: "Screen Share",
    sub: "Share your screen easily.",
    tone: "social",
    gradient: "from-[#001028] via-[#0b355e] to-[#052e5e]",
    videoSrc: "/media/screen-share.mp4",
  },
  {
    title: "Group Calls",
    sub: "Connect with your team.",
    tone: "standout",
    gradient: "from-[#0b0b0b] via-[#1f2937] to-[#0b1220]",
    videoSrc: "/media/group-calls.mp4",
  },
  {
    title: "Secure",
    sub: "End-to-end encryption.",
    tone: "premium",
    gradient: "from-[#0b0b0b] via-[#111827] to-[#052e16]",
    videoSrc: "/media/secure.mp4",
  },
];
