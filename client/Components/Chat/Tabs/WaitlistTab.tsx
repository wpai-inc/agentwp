export default function WaitlistTab( { children }: { children: React.ReactNode } ) {
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-white/50 items-center flex flex-col justify-center">
        <div className="p-8 space-y-4 text-center max-w-md flex flex-col">
          <h2 className="text-3xl font-semibold">You’re on the waitlist...</h2>
          <p>Search Anything WordPress will be available soon.</p>
          <a href="#" className="underline underline-offset-4 hover:text-brand-primary">
            Learn More
          </a>
        </div>
      </div>
      { children }
    </div>
  );
}
