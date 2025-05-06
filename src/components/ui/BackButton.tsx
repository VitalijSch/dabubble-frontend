"use client";

import { useRouter } from "next/navigation";

interface BackButtonProps {
  className: string;
}

export default function BackButton({ className }: BackButtonProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.back()}
      className={`group rounded-full cursor-pointer hover:bg-[#ECEEFE] transition-colors duration-300 ease-in-out ${className}`}
    >
      <svg
        width="41"
        height="41"
        viewBox="0 0 41 41"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          className="group-hover:text-[#535AF1] transition-colors duration-300 ease-in-out"
          d="M19.7412 27.8001L13.1412 21.2001C13.0412 21.1001 12.9702 20.9917 12.9282 20.8751C12.8869 20.7584 12.8662 20.6334 12.8662 20.5001C12.8662 20.3667 12.8869 20.2417 12.9282 20.1251C12.9702 20.0084 13.0412 19.9001 13.1412 19.8001L19.7412 13.2001C19.9245 13.0167 20.1535 12.9207 20.4282 12.9121C20.7035 12.9041 20.9412 13.0001 21.1412 13.2001C21.3412 13.3834 21.4455 13.6124 21.4542 13.8871C21.4622 14.1624 21.3662 14.4001 21.1662 14.6001L16.2662 19.5001H27.4412C27.7245 19.5001 27.9622 19.5957 28.1542 19.7871C28.3455 19.9791 28.4412 20.2167 28.4412 20.5001C28.4412 20.7834 28.3455 21.0207 28.1542 21.2121C27.9622 21.4041 27.7245 21.5001 27.4412 21.5001H16.2662L21.1662 26.4001C21.3495 26.5834 21.4455 26.8167 21.4542 27.1001C21.4622 27.3834 21.3662 27.6167 21.1662 27.8001C20.9829 28.0001 20.7495 28.1001 20.4662 28.1001C20.1829 28.1001 19.9412 28.0001 19.7412 27.8001Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}
