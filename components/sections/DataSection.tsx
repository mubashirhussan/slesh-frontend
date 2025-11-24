export default function DataSection() {
  return (
    <section className="relative h-[733px] mt-16 w-full overflow-hidden">
      
      {/* Background Image Layer (same as .ds-bg-image) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(180deg, rgba(154,154,165,0) 0%, rgba(154,154,165,0.06) 100%),
            url('/data-section-bg.svg')
          `,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center, center top",
          backgroundSize: "100% 100%, 500px auto",
        }}
      ></div>

      {/* Content Wrapper (same as .ds-content) */}
      <div className="relative h-full flex flex-col items-center justify-end pb-[180px] gap-6 z-10">

        {/* Text Container (same as .ds-text) */}
        <div className="flex flex-col items-center gap-[18px]">

          {/* Heading */}
          <h2 className="font-medium text-[24px] leading-[120%] tracking-[-0.02em] text-center text-black">
            Your data stays yours.
          </h2>

          {/* Paragraph (feature-text + feature-span classes) */}
          <p className="font-normal text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[#9A9AA5] md:w-[430px] w-full mx-auto">
            You have full control over your account, including access and
            deletion.{" "}
            <span className="font-medium text-[16px] leading-[130%] tracking-[-0.02em] text-center text-[rgba(9,9,11,0.7)]">
              Every feature that uses your data is optional and can be turned off at any time.
            </span>
            <br />
            <br />
            Slesh always asks before doing anything on your behalf, giving you
            full visibility and control every step of the way.
          </p>
        </div>
      </div>
    </section>
  );
}
