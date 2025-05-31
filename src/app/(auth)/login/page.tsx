import LoginForm from "@/features/login/components/LoginForm";

export default function Login() {
  return (
    <div className="max-w-[606px] max-h-[769px] w-full h-full flex flex-col gap-[30px] items-center py-[50px] px-[60px] mb-[65px] bg-[#FFFFFF] rounded-[30px] shadow-[0px_2px_10px_0px_#00000014]">
      <h1 className="text-[46px] text-[#444DF2] font-[700]">Anmeldung</h1>
      <p className="text-[20px] text-center">
        Wir empfehlen dir, die E-Mail-Adresse zu nutzen, die du bei der Arbeit
        verwendest.
      </p>
      <LoginForm />
    </div>
  );
}
