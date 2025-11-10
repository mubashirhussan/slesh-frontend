import React from 'react';
import type { CallToActionCard as CtaCardType } from '@/types/sanity';

interface CtaCardProps {
  ctaInfo?: CtaCardType;
}

const CtaCard: React.FC<CtaCardProps> = ({ ctaInfo }) => {
  if (!ctaInfo) return null; // handle undefined gracefully

  return (
    <section className="rounded-lg">
      <p className=" text-black text-md">{ctaInfo.description}</p>
      <a
        href={ctaInfo.buttonUrl}
        className="inline-block my-4  w-full text-center  p-2 bg-[#005BB5] text-white rounded hover:bg-blue-600"
      >
        {ctaInfo.buttonText}
      </a>
    </section>
  );
};

export default CtaCard;
