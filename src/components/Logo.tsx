import Link from "next/link";

export default function Logo({
  className = "",
  imgClassName = "h-6 lg:h-8 w-auto",
  href = "/",
}: {
  className?: string;
  imgClassName?: string;
  href?: string;
}) {
  return (
    <Link href={href} className={className} aria-label="FreshCart home">
      {/* Two identical SVGs: the wordmark is dark navy, which is unreadable on the
          dark header/footer surfaces, so dark mode swaps in the light variant. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/freshcart-logo.svg"
        alt="FreshCart"
        width={160}
        height={31}
        className={`${imgClassName} dark:hidden`}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/freshcart-logo-dark.svg"
        alt=""
        aria-hidden="true"
        width={160}
        height={31}
        className={`${imgClassName} hidden dark:block`}
      />
    </Link>
  );
}