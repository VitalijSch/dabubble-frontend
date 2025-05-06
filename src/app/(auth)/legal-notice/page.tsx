import BackButton from "@/components/ui/BackButton";

export default function LegalNotice() {
  return (
    <div className="max-w-[698px] w-full h-fit flex flex-col gap-[32px] py-[40px] px-[56px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014] relative">
      <BackButton />
      <div className="flex flex-col gap-1">
        <h1 className="text-[46px] text-[#444DF2] font-[700]">Impressum</h1>
        <div className="flex flex-col gap-1 text-[20px]">
          <span>Vitalij Schwab</span>
          <span>Kirschbaumallee 18</span>
          <span>77933 Lahr</span>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <h2 className="text-[32px] text-[#444DF2] font-[700]">Contact:</h2>
        <span className="text-[20px]">E-Mail: schwab.vitalij@gmail.com</span>
      </div>
    </div>
  );
}
