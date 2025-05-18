interface FormInputProps {
  placeholder: string;
  type: string;
  name: string;
  id: string;
  Icon: React.ElementType;
  error?: string;
  value?: string;
}

export default function FormInput({
  placeholder,
  type,
  name,
  id,
  Icon,
  error,
  value,
  ...inputProps
}: FormInputProps) {
  return (
    <div className="h-[87px] flex flex-col gap-[6px]">
      <div className="w-full h-[60px] relative">
        <input
          className="peer w-full h-full py-[18px] pl-[86px] pr-[32px] bg-[#ECEEFE] border border-transparent rounded-[100px] outline-none cursor-pointer placeholder:text-[18px] placeholder:text-[#686868] placeholder:font-[500] hover:border-[#686868] focus:border-[#535AF1] transition-all duration-300 ease-in-out"
          defaultValue={value}
          placeholder={placeholder}
          type={type}
          name={name}
          id={id}
          {...inputProps}
        />
        <Icon className="absolute top-1/2 left-[32px] -translate-y-1/2 text-[#686868] peer-focus:text-[#000000] transition-colors duration-300 ease-in-out" />
      </div>
      {error && <span className="text-[14px] text-[#ED1E79]">{error}</span>}
    </div>
  );
}
