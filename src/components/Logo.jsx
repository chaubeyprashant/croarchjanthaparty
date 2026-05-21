export function Logo({ size = 40 }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      width={size}
      height={size}
      className="logo-mark"
    >
      <circle cx="32" cy="32" r="31" fill="#f4ede3" stroke="#1f1510" strokeWidth="2" />
      <ellipse cx="32" cy="34" rx="10" ry="14" fill="#6b3f1f" />
      <ellipse cx="32" cy="22" rx="6" ry="5" fill="#6b3f1f" />
      <line x1="22" y1="28" x2="14" y2="22" stroke="#6b3f1f" strokeWidth="2" />
      <line x1="22" y1="34" x2="12" y2="34" stroke="#6b3f1f" strokeWidth="2" />
      <line x1="22" y1="40" x2="14" y2="46" stroke="#6b3f1f" strokeWidth="2" />
      <line x1="42" y1="28" x2="50" y2="22" stroke="#6b3f1f" strokeWidth="2" />
      <line x1="42" y1="34" x2="52" y2="34" stroke="#6b3f1f" strokeWidth="2" />
      <line x1="42" y1="40" x2="50" y2="46" stroke="#6b3f1f" strokeWidth="2" />
      <circle cx="29" cy="20" r="1.5" fill="#f4ede3" />
      <circle cx="35" cy="20" r="1.5" fill="#f4ede3" />
    </svg>
  )
}
