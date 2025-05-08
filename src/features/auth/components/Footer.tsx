import LinkButton from "@/components/LinkButton";

export default function Footer() {
  return (
    <div className="max-w-[270px] max-h-[42px] w-full h-full flex justify-center items-center gap-[16px] mx-auto">
      <LinkButton name="Impressum" link="/legal-notice" />
      <LinkButton name="Datenschutz" link="/privacy-policy" />
    </div>
  );
}
