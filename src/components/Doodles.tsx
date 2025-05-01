
import React from 'react';

export const CircleDoodle = () => {
  return (
    <svg 
      className="opacity-10 dark:opacity-5" 
      viewBox="0 0 195 160" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_103_6626)">
        <path
          d="M194.255 52.3612C194.255 49.8332 193.251 47.4088 191.464 45.6212C189.677 43.8337 187.253 42.8295 184.725 42.8295C182.198 42.8295 179.774 43.8337 177.986 45.6212C176.199 47.4088 175.195 49.8332 175.195 52.3612C175.195 100.793 135.804 140.191 87.3858 140.191C69.2674 140.167 51.8981 132.957 39.0874 120.142C26.2767 107.328 19.0706 89.9541 19.0496 71.8325C19.065 57.8392 24.6297 44.4235 34.5227 34.5288C44.4157 24.634 57.8291 19.0684 71.8199 19.053C82.5076 19.0656 92.7539 23.3176 100.311 30.8762C107.868 38.4348 112.12 48.6829 112.132 59.3724C112.122 67.4209 108.92 75.1368 103.229 80.8265C97.537 86.5162 89.8208 89.7149 81.7736 89.7205C75.8426 89.7149 70.1562 87.3559 65.9623 83.1613C61.7685 78.9668 59.4099 73.2793 59.4043 67.3473C59.4099 63.1076 61.0963 59.0432 64.0937 56.0453C67.0911 53.0474 71.1548 51.3607 75.3937 51.3551C78.2804 51.3579 81.0481 52.5057 83.0897 54.5467C85.1314 56.5877 86.2803 59.3554 86.2845 62.2425C86.2845 64.7705 87.2886 67.1949 89.0758 68.9825C90.8631 70.77 93.2871 71.7743 95.8146 71.7743C98.3422 71.7743 100.766 70.77 102.553 68.9825C104.341 67.1949 105.345 64.7705 105.345 62.2425C105.335 54.3067 102.179 46.6985 96.5699 41.086C90.9604 35.4736 83.3547 32.3147 75.4202 32.3021C66.1289 32.3105 57.2204 36.0051 50.6494 42.5753C44.0785 49.1454 40.3818 58.0544 40.3706 67.3473C40.3818 78.328 44.747 88.856 52.5087 96.622C60.2704 104.388 70.7948 108.758 81.7736 108.773C94.8686 108.758 107.423 103.548 116.682 94.2872C125.942 85.026 131.151 72.4696 131.166 59.3724C131.148 43.6342 124.89 28.5456 113.765 17.4155C102.64 6.28542 87.5554 0.0224225 71.8199 0C32.2171 0 0 32.2227 0 71.8325C0 120.021 39.2058 159.244 87.3964 159.244C146.319 159.244 194.255 111.294 194.255 52.3612Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_103_6626">
          <rect width="194.255" height="159.244" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  );
};

export const DiamondDoodle = () => {
  return (
    <svg 
      className="opacity-10 dark:opacity-5" 
      viewBox="0 0 98 124" 
      fill="currentColor" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M64.5501 14.2107C82.357 31.8463 82.357 60.6113 64.5501 78.247L0 14.2107C17.8069 -3.42504 46.7432 -3.42504 64.5501 14.2107Z"
        fill="currentColor"
      />
      <path
        d="M29.4499 108.039C11.643 90.4036 11.643 61.6386 29.4499 44.0029L94 108.039C76.3643 125.675 47.428 125.675 29.4499 108.039Z"
        stroke="currentColor"
        strokeWidth="4.30653"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

// Additional doodles that will randomly appear
export const SquareDoodle = () => {
  return (
    <svg 
      className="opacity-10 dark:opacity-5" 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="80" height="80" rx="8" stroke="currentColor" strokeWidth="4" />
      <rect x="30" y="30" width="40" height="40" rx="4" fill="currentColor" />
    </svg>
  );
};

export const WaveDoodle = () => {
  return (
    <svg 
      className="opacity-10 dark:opacity-5" 
      width="140" 
      height="40" 
      viewBox="0 0 140 40" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 20C20 5 30 35 50 20C70 5 80 35 100 20C120 5 130 35 150 20"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const DotGridDoodle = () => {
  return (
    <svg 
      className="opacity-10 dark:opacity-5" 
      width="100" 
      height="100" 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {[...Array(5)].map((_, rowIndex) => (
        [...Array(5)].map((_, colIndex) => (
          <circle
            key={`${rowIndex}-${colIndex}`}
            cx={10 + colIndex * 20}
            cy={10 + rowIndex * 20}
            r="4"
            fill="currentColor"
          />
        ))
      ))}
    </svg>
  );
};

const BackgroundDoodles = () => {
  return (
    <>
      {/* Left side doodles */}
      <div className="fixed left-4 top-1/4 w-32 h-32 text-purple-300 dark:text-purple-900 transform -rotate-12 pointer-events-none">
        <CircleDoodle />
      </div>
      <div className="fixed left-16 top-2/3 w-24 h-24 text-blue-300 dark:text-blue-900 transform rotate-45 pointer-events-none">
        <DiamondDoodle />
      </div>
      <div className="fixed left-8 bottom-1/4 w-28 h-28 text-pink-300 dark:text-pink-900 pointer-events-none">
        <SquareDoodle />
      </div>
      <div className="fixed left-2 bottom-12 w-32 h-32 text-purple-200 dark:text-purple-900 transform -rotate-6 pointer-events-none">
        <DotGridDoodle />
      </div>
      
      {/* Right side doodles */}
      <div className="fixed right-8 top-1/3 w-32 h-32 text-teal-300 dark:text-teal-900 transform rotate-12 pointer-events-none">
        <CircleDoodle />
      </div>
      <div className="fixed right-16 top-3/4 w-28 h-28 text-amber-300 dark:text-amber-900 transform -rotate-12 pointer-events-none">
        <DiamondDoodle />
      </div>
      <div className="fixed right-4 bottom-20 w-28 h-10 text-blue-300 dark:text-blue-900 transform rotate-6 pointer-events-none">
        <WaveDoodle />
      </div>
      <div className="fixed right-12 top-1/4 w-24 h-24 text-green-300 dark:text-green-900 pointer-events-none">
        <DotGridDoodle />
      </div>
    </>
  );
};

export default BackgroundDoodles;
