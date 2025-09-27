export function PetCareLogo() {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Paw print shape */}
          <circle cx="20" cy="15" r="8" fill="#4A90E2"/>
          <circle cx="40" cy="15" r="8" fill="#4A90E2"/>
          <circle cx="15" cy="35" r="6" fill="#4A90E2"/>
          <circle cx="45" cy="35" r="6" fill="#4A90E2"/>
          <ellipse cx="30" cy="42" rx="12" ry="10" fill="#4A90E2"/>
          {/* Heart shape overlay */}
          <path 
            d="M30 35c-3-6-12-6-12 0 0 6 12 12 12 12s12-6 12-12c0-6-9-6-12 0z" 
            fill="#FF6B6B"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white">PETCARE</h1>
        <h2 className="text-3xl font-bold text-white">CONNECT</h2>
      </div>
    </div>
  );
}