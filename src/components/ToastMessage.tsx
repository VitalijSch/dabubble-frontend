interface ToastMessageProps {
  Icon?: React.ElementType;
  className?: string;
  text: string;
}

export default function ToastMessage({
  Icon,
  className,
  text,
}: ToastMessageProps) {
  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 z-[9999] bg-white/30">
      <div
        className={`${className} max-w-[531px] h-[149px] flex items-center gap-[20px] px-[50px] bg-[#444DF2] rounded-tl-[30px] rounded-tr-[30px] rounded-bl-[30px] shadow-[0px_6px_10px_0px_#00000033] animate-moveToBottomRight`}
      >
        {Icon && <Icon />}
        <span className="text-[36px] text-[#FFFFFF] font-[700]">{text}</span>
      </div>
    </div>
  );
}
