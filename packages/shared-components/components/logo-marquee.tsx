import Image from "next/image"

export function LogoMarquee() {
  return (
    <section className="container mx-auto px-4 py-10">
      <div className="flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-neutral-500">Supporting collaboration across PSU College</p>
          <div className="mt-4 flex animate-scroll-right items-center justify-center gap-12 whitespace-nowrap py-4 sm:gap-20">
            {logos.map((logo, i) => (
              <Image
                key={i}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-8 w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />
            ))}
            {/* Duplicate for seamless loop */}
            {logos.map((logo, i) => (
              <Image
                key={`dup-${i}`}
                src={logo.src}
                alt={logo.alt}
                width={logo.width}
                height={logo.height}
                className="h-8 w-auto opacity-60 grayscale hover:opacity-100 hover:grayscale-0 transition-all"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const logos = [
  {
    src: "/icons/com-psu-rizal-white.svg",
    alt: "COM-PSU-Rizal",
    width: 120,
    height: 32,
  },
  {
    src: "/icons/com-psu-rizal-white.svg",
    alt: "COM-PSU-Rizal",
    width: 120,
    height: 32,
  },
  {
    src: "/icons/com-psu-rizal-white.svg",
    alt: "COM-PSU-Rizal",
    width: 120,
    height: 32,
  },
  {
    src: "/icons/com-psu-rizal-white.svg",
    alt: "COM-PSU-Rizal",
    width: 120,
    height: 32,
  },
  {
    src: "/icons/com-psu-rizal-white.svg",
    alt: "COM-PSU-Rizal",
    width: 120,
    height: 32,
  },
]