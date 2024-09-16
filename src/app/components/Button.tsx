export enum Type {
  primary,
  secondary,
  danger,
}

interface Button {
  children: string;
  onClick?: () => void;
  type?: Type;
  active?: boolean;
  disabled?: boolean;
}

function Button({ children, onClick, type, active, disabled }: Button) {
  return (
    <button
      disabled={disabled}
      className={`px-3 md:px-6 py-1.5 md:py-3 rounded-lg max-w-60 hover:scale-105 transition-all ease-in-out delay-50 text-[10px] sm:text-sm cursor-pointer ${
        type === Type.secondary
          ? "border border-neutral-700 hover:scale-105 text-neutral-200"
          : type === Type.danger
          ? "border border-rose-800 hover:scale-105 text-rose-500"
          : `bg-violet-500 hover:bg-violet-400 ${
              active
                ? "bg-violet-800 text-neutral-200 outline outline-1 md:outline-2 outline-offset-4 outline-violet-500"
                : "text-neutral-900"
            }`
      } ${disabled && "cursor-not-allowed"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;

// function Button({ children, onClick, type }: Button) {
//   return (
//     <button
//       className={`px-6 py-3 rounded-lg`}
//       onClick={onClick}
//     >
//       {children}
//     </button>
//   );
// }

// export default Button;
