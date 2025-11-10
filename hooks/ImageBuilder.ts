/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/sanity.image.ts
import { sanityClient } from '@/lib/sanity.client';
import imageUrlBuilder from '@sanity/image-url';


const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
