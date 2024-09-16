// import { useEffect, useState } from "react";

// function Progress() {
//   const [progress, setProgress] = useState(0);

//   useEffect(() => {
//     let inter: any;
//     if (progress < 100) {
//       inter = setInterval(() => {
//         setProgress((progress) => progress + 1.25);
//       }, 1000);
//     }

//     return () => {
//       clearInterval(inter);
//     };
//   }, [progress, setProgress]);

//   return (
//     <div className="flex justify-center items-center">
//       <div className="flex flex-col justify-center items-center gap-3">
//         <div className="relative w-[400px] bg-violet-100 rounded-2xl h-1">
//           <div
//             style={{
//               width: `${progress}%`,
//             }}
//             className={`bg-violet-600 flex justify-center h-1 rounded-2xl ${
//               progress !== 100 ? "rounded-r-none" : "rounded-r-2xl"
//             }`}
//           ></div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Progress;

import { useState } from "react";

function ProgressButton({
  children,
  onClick,
  disabled,
  inc,
}: {
  children: string;
  onClick?: () => void;
  disabled: boolean;
  inc: number;
}) {
  const [progress, setProgress] = useState(0);

  const handleClick = () => {
    onClick!();
    if (progress < 100) {
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress + inc >= 100) {
            clearInterval(interval); // Stop the interval once progress reaches 100
            return 100;
          }
          return prevProgress + inc;
        });
      }, 1000);
    }
  };
  return (
    <div>
      <div
        className={`outline outline-1 outline-offset-3 outline-violet-500 h-10 w-[144px] rounded-lg relative ${
          disabled && "cursor-not-allowed"
        }`}
      >
        <button
          disabled={disabled}
          onClick={() => {
            handleClick();
          }}
          className={`bg-violet-800 rounded-lg h-10 text-sm ${
            progress !== 100 ? "rounded-r-none" : "rounded-r-lg"
          } ${disabled && "cursor-not-allowed"}`}
          style={{
            width: `${progress}%`,
          }}
        >
          <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-violet-100">
            {children}
          </span>
        </button>
      </div>
    </div>
  );
}

export default ProgressButton;
