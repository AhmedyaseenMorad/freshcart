import { Ico } from "./Icons";

export default function Stars({
  value,
  className = "",
  iconClassName = "text-[11px]",
}: {
  value: number;
  className?: string;
  iconClassName?: string;
}) {
  const rounded = Math.round(value);
  return (
    <span className={`flex items-center text-amber-400 ${className}`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Ico key={i} name={i < rounded ? "star" : "star-far"} className={iconClassName} />
      ))}
    </span>
  );
}