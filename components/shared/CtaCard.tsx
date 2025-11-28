import React from "react";
import type { CallToActionCard as CtaCardType } from "@/types/sanity";

interface CtaCardProps {
  ctaInfo?: CtaCardType;
}

const CtaCard: React.FC<CtaCardProps> = ({ ctaInfo }) => {
  if (!ctaInfo) return null; // handle undefined gracefully

  return (
    <section className="rounded-lg">
      <p className="text-md! text-[#475467]!">{ctaInfo.description}</p>
      <a
        href={ctaInfo.buttonUrl}
        className="my-4! inline-block! w-full! rounded! bg-(--color-primary)! p-2! text-center! text-white! transition! hover:bg-[#0042d1]!"
      >
        {ctaInfo.buttonText}
      </a>
    </section>
  );
};

export default CtaCard;
