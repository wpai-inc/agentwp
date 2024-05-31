import { cn } from "@/lib/utils";

type Props = {
  message: string;
  onClick: () => void;
}

const ChatOption = ({
  message,
  onClick,
}: Props) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        'flex items-center justify-center shadow-sm',
        'p-4 bg-brand-gray-20 cursor-pointer h-full w-full',
        'rounded-lg hover:bg-gray-50',
        'text-center text-gray-600 transition duration-200'
      )}
    >
      <p className=" ">
        {message}
      </p>
    </div>
  )
};

export default ChatOption;
