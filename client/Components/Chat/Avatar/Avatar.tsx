export default function Avatar({
  name,
  time,
  image,
}: {
  name: string;
  time: string;
  image?: string;
}) {
  return (
    <div className="flex gap-2 items-center">
      {image ? (
        <img src={image} alt={name} className="w-8 h-8 rounded-full" />
      ) : (
        <div className="w-8 h-8 flex items-center justify-center font-bold bg-white rounded-full">
          {name}
        </div>
      )}

      <div className="flex flex-col justify-center">
        <h3 className="font-bold text-sm">{name}</h3>
        <time className="text-xs">{time}</time>
      </div>
    </div>
  );
}
