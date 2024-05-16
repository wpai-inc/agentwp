export default function Avatar({ name, time }: { name: string; time: string }) {
  return (
    <div className="flex gap-2 items-center">
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-green-500 text-white rounded-full">
        {name[0]}
      </div>
      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-sm">{name}</h3>
        <time className="text-xs">{time}</time>
      </div>
    </div>
  );
}
