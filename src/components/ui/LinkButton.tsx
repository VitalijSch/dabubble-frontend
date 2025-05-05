import Link from "next/link";

interface LinkButtonProps {
  name: string;
  link: string;
}

export default function LinkButton({ name, link }: LinkButtonProps) {
  return (
    <Link
      href={link}
      className="w-[153px] h-[42px] flex justify-center items-center text-[18px] text-[#797EF3] leading-[120%] figtree border border-transparent rounded-[25px] cursor-pointer hover:font-[500] hover:border-[#686868] hover:text-[#444DF2] transition-all duration-300 ease-in"
    >
      {name}
    </Link>
  );
}
