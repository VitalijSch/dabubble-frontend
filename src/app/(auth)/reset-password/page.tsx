import BackButton from "@/components/BackButton";
import BackgroundButton from "@/components/BackgroundButton";

export default function ResetPassword() {
  return (
    <div className="max-w-[692px] max-h-[423px] w-full h-full flex flex-col gap-[40px] items-center py-[40px] px-[90px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton className="absolute top-[50px] left-[32px]" />
      <h1 className="text-[46px] text-[#444DF2] font-[700]">
        Passwort zurücksetzen
      </h1>
      <form className="w-full h-full flex flex-col justify-between px-[56px]">
        <input
          className="w-full h-[58px] py-[18px] px-[32px] bg-[#ECEEFE] border border-transparent rounded-[100px] outline-none cursor-pointer placeholder:text-[18px] placeholder:text-[#686868] placeholder:font-[500] hover:border-[#686868] focus:border-[#535AF1] transition-all duration-300 ease-in-out"
          placeholder="Neues Passwort"
          type="password"
          name="password"
          id="password"
        />
        <div className="flex flex-col gap-[4px]">
          <input
            className="w-full h-[58px] py-[18px] px-[32px] bg-[#ECEEFE] border border-transparent rounded-[100px] outline-none cursor-pointer placeholder:text-[18px] placeholder:text-[#686868] placeholder:font-[500] hover:border-[#686868] focus:border-[#535AF1] transition-all duration-300 ease-in-out"
            placeholder="Neues Kennwort bestätigen"
            type="password"
            name="newPassword"
            id="newPassword"
          />
          <span className="text-[14px] text-[#ED1E79]">
            *Diese E-Mail-Adresse ist leider ungültig.
          </span>
        </div>
        <div className="self-end flex justify-center items-center gap-[30px]">
          <BackgroundButton
            type="button"
            className="bg-[#686868] text-[#FFFFFF] pointer-events-none"
            name="Passwort ändern"
          />
        </div>
      </form>
    </div>
  );
}
