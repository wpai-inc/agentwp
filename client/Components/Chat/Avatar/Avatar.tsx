function Avatar({ name, time }: { name: string; time: string }) {
  return (
    <div>
      <div className="w-8 h-8 flex items-center justify-center font-bold bg-green-500 text-white rounded-full">
        {name[0]}
      </div>
      <h3>{name}</h3>
      <time>{time}</time>
    </div>
  );
}

export default Avatar;
