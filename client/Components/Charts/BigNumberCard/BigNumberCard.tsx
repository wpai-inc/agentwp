export default function BigNumberCard( { data }: { data: any } ) {
  const datum = data[ 0 ];
  const [ label, value ] = Object.values( datum );
  return (
    <div className="rounded-xl bg-white text-brand-dark text-center p-6">
      <h2 className="text-5xl leading-none text-brand-secondary">{ value }</h2>
      <h1 className="font-bold text-sm uppercase tracking-wider">{ label }</h1>
    </div>
  );
}
