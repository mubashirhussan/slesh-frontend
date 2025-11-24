export default function DataSection() {
  return (
    <section className="relative h-screen flex flex-col items-center justify-center bg-gray-100 overflow-hidden">
      {/* Image at top half */}
      <div
        className="w-full max-w-5xl flex-shrink-0"
        style={{
          height: "50%", // image takes top half
          backgroundImage: `url('/data-section-bg.svg')`,
          backgroundSize: "contain",
          backgroundPosition: "center top",
          backgroundRepeat: "no-repeat",
          marginTop: "10%",
        }}
      ></div>

      {/* Content at bottom half */}
      <div className="relative max-w-4xl text-center z-10 -mt-90 px-6 flex-1 flex flex-col justify-center gap-4">
        <h2 className="text-lg lg:text-2xl font-medium">
          Your data stays yours.
        </h2>
       <p className="font-normal text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[#9A9AA5] w-[500px] mx-auto">
  You have full control over your account, including access and deletion.{" "}
  <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
    Every feature that uses your data is optional and can be turned off at any time.
  </span>
  <br />
  <br />
  Slesh always asks before doing anything on your behalf, giving you full visibility and control every step of the way.
</p>

      </div>
    </section>
  );
}
