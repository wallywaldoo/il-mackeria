export function SwedishFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 20"
      className={className}
      aria-hidden
    >
      <rect width="32" height="20" fill="#006AA7" />
      <rect x="10" width="4" height="20" fill="#FECC00" />
      <rect y="8" width="32" height="4" fill="#FECC00" />
    </svg>
  );
}

export function BritishFlagIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 20"
      className={className}
      aria-hidden
    >
      <rect width="32" height="20" fill="#012169" />
      <path d="M0 0 32 20M32 0 0 20" stroke="#fff" strokeWidth="3.5" />
      <path d="M0 0 32 20M32 0 0 20" stroke="#C8102E" strokeWidth="2" />
      <path d="M16 0V20M0 10H32" stroke="#fff" strokeWidth="6" />
      <path d="M16 0V20M0 10H32" stroke="#C8102E" strokeWidth="3.5" />
    </svg>
  );
}
