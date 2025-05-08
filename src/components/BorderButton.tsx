interface BorderButtonProps {
  type: "submit" | "button";
  className?: string;
  name: string;
}

export default function BorderButton({
  type,
  className,
  name,
}: BorderButtonProps) {
  return (
    <button
      type={type}
      className={`${className} w-fit h-[49px] flex justify-center items-center px-[25px] text-[18px] text-[#444DF2] font-[700] border border-[#797EF3] rounded-[25px] cursor-pointer hover:text-[#FFFFFF] hover:bg-[#444DF2] hover:border-transparent transition-colors duration-300 ease-in-out`}
    >
      {name}
    </button>
  );
}
