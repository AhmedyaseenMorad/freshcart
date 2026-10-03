export default function Spinner({ className = "h-10 w-10 border-4" }: { className?: string }) {
  return (
    <div
      className={`animate-spin rounded-full border-line-2 border-t-primary-600 ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}