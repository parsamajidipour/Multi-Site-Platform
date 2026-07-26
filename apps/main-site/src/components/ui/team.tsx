import { UserRound } from "lucide-react";

import { cn } from "@/lib/utils";

import { Marquee } from "@/components/ui/marquee";

export type TeamMember = {
  image: string;
  name: string;
  role: string;
  bio?: string;
};

export type TeamShowcaseProps = {
  eyebrow?: string;
  title?: string;
  summary?: string;
  members: TeamMember[];
  quote?: string;
  quoteAuthor?: string;
  quoteRole?: string;
  quoteImage?: string;
  variant?: "light" | "dark";
  className?: string;
  showQuote?: boolean;
};

const PLACEHOLDER_IMAGE = "/media/team/placeholder.svg";

export function resolveTeamImage(imageUrl: string | undefined, _index: number) {
  return imageUrl && String(imageUrl).trim() ? imageUrl : PLACEHOLDER_IMAGE;
}

export function TeamShowcase({
  eyebrow = "Team",
  title = "The people behind clear routing and specialist delivery.",
  summary = "Meet the leadership group that keeps group communication clear and connects clients to the right specialist desk.",
  members,
  quote = "REZAEI GLOBAL LLC keeps group-level communication clear so every request reaches the specialist desk that can respond with context.",
  quoteAuthor = "Hosein Rezaei",
  quoteRole = "Group Managing Director · REZAEI GLOBAL LLC",
  quoteImage,
  variant = "light",
  className,
  showQuote = true,
}: TeamShowcaseProps) {
  const isDark = variant === "dark";
  const marqueeMembers = members.length > 0 ? [...members, ...members] : members;
  const quotePortrait = quoteImage || resolveTeamImage(members[0]?.image, 0);

  return (
    <section
      className={cn(
        "teamShowcase relative w-full overflow-hidden py-10 md:py-16",
        isDark ? "teamShowcase--dark bg-transparent" : "teamShowcase--light",
        className,
      )}
    >
      <svg
        className={cn(
          "pointer-events-none absolute bottom-0 right-0",
          isDark ? "text-white/10" : "text-slate-200",
        )}
        fill="none"
        height="154"
        viewBox="0 0 460 154"
        width="460"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <g clipPath="url(#team-showcase-clip)">
          <path
            d="M-87.463 458.432C-102.118 348.092 -77.3418 238.841 -15.0744 188.274C57.4129 129.408 180.708 150.071 351.748 341.128C278.246 -374.233 633.954 380.602 548.123 42.7707"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="40"
          />
        </g>
        <defs>
          <clipPath id="team-showcase-clip">
            <rect fill="white" height="154" width="460" />
          </clipPath>
        </defs>
      </svg>

      <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto mb-12 flex max-w-5xl flex-col items-center text-center md:mb-16">
          <div
            className={cn(
              "teamShowcase-icon mb-6 flex h-12 w-12 items-center justify-center rounded-xl",
              isDark ? "bg-[#f97316]" : "bg-[#00357f]",
            )}
          >
            <UserRound size={24} strokeWidth={2.2} className="text-white" aria-hidden="true" />
          </div>

          <p className="teamShowcase-eyebrow mb-3 text-xs font-bold uppercase tracking-[0.14em]">
            {eyebrow}
          </p>

          <h2 className="teamShowcase-title relative mb-4 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h2>

          <p className="teamShowcase-summary max-w-2xl text-base leading-relaxed md:text-lg">
            {summary}
          </p>
        </div>

        <div className="relative w-full">
          <div className={cn("teamShowcase-fade teamShowcase-fade--left pointer-events-none absolute left-0 top-0 z-10 h-full w-16 md:w-32")} />
          <div className={cn("teamShowcase-fade teamShowcase-fade--right pointer-events-none absolute right-0 top-0 z-10 h-full w-16 md:w-32")} />

          <Marquee className="[--gap:1.5rem]" pauseOnHover repeat={2}>
            {marqueeMembers.map((member, index) => (
              <div className="group flex w-64 shrink-0 flex-col" key={`${member.name}-${index}`}>
                <div className="teamShowcase-card relative h-[23rem] w-full overflow-hidden rounded-2xl">
                  <img
                    alt={member.name}
                    className="h-full w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
                    loading="lazy"
                    src={member.image}
                  />
                  <div className="teamShowcase-memberPanel absolute bottom-0 w-full rounded-lg p-3">
                    <h3 className="teamShowcase-memberName font-semibold">{member.name}</h3>
                    <p className="teamShowcase-memberRole text-sm">{member.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Marquee>
        </div>

        {showQuote ? (
          <div className="mx-auto mt-16 max-w-3xl text-center md:mt-20">
            <p className="teamShowcase-quote mb-8 text-lg font-medium leading-relaxed md:text-xl">
              {quote}
            </p>
            <div className="flex flex-col items-center gap-3">
              <div className="relative h-14 w-14 overflow-hidden rounded-full ring-2 ring-[#f97316]/40">
                <img alt={quoteAuthor} className="h-full w-full object-cover" loading="lazy" src={quotePortrait} />
              </div>
              <div className="text-center">
                <p className="teamShowcase-quoteAuthor font-semibold">{quoteAuthor}</p>
                <p className="teamShowcase-quoteRole text-sm">{quoteRole}</p>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
