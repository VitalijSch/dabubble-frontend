"use client";

import CheckedIcon from "@/components/icons/CheckedIcon";
import CheckIcon from "@/components/icons/CheckIcon";
import Link from "next/link";
import { useSigninStore } from "../stores/useSigninStore";
import { useEffect } from "react";

export default function Checkbox() {
  const isChecked = useSigninStore((state) => state.isChecked);
  const setIsChecked = useSigninStore((state) => state.setIsChecked);
  const user = useSigninStore((state) => state.user);

  useEffect(() => {
    if (user) {
      setIsChecked(true);
    } else {
      setIsChecked(null);
    }
  }, [user]);

  return (
    <div className="h-[48px]">
      <div className="flex items-center gap-[8px]">
        {isChecked ? (
          <div
            onClick={() => setIsChecked(false)}
            className="group w-fit rounded-full cursor-pointer hover:bg-[#ECEEFE] transition-colors duration-300 ease-in-out"
          >
            <CheckedIcon className="text-[#797EF3] group-hover:text-[#444DF2] transition-colors duration-300 ease-in-out" />
          </div>
        ) : (
          <div
            onClick={() => setIsChecked(true)}
            className="group w-fit rounded-full cursor-pointer hover:bg-[#ECEEFE] transition-colors duration-300 ease-in-out"
          >
            <CheckIcon className="text-[#797EF3] group-hover:text-[#444DF2] transition-colors duration-300 ease-in-out" />
          </div>
        )}
        <p className="text-[#42526E] figtree">
          Ich stimme der{" "}
          <Link
            href="/privacy-policy"
            className="py-[5px] px-[4px] text-[#797EF3] rounded-[30px] hover:text-[#444DF2] hover:bg-[#ECEEFE] transition-colors duration-300 ease-in-out"
          >
            Datenschutzerklärung
          </Link>{" "}
          zu.
        </p>
      </div>
      {isChecked === false && (
        <span className="text-[14px] text-[#ED1E79]">
          Eine Zustimmung zur Datenschutzerklärung ist erforderlich.
        </span>
      )}
    </div>
  );
}
