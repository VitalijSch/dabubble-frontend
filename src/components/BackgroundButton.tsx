interface BackgroundButtonProps {
  type: "submit" | "button";
  className?: string;
  name: string;
}

export default function BackgroundButton({
  type,
  name,
  className,
}: BackgroundButtonProps) {
  return (
    <button
      type={type}
      className={`${className} w-fit h-[49px] flex justify-center items-center px-[25px] text-[18px] text-[#FFFFFF] font-[700] bg-[#444DF2] rounded-[25px] cursor-pointer hover:bg-[#797EF3] transition-colors duration-300 ease-in-out`}
    >
      {name}
    </button>
  );
}
