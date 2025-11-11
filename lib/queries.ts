import { groq } from "next-sanity";

// Landing page
export const landingQuery = groq`{
	"hero": *[_type == "hero"][0]{ title, subtitle, ctaText, ctaHref },
	"features": *[_type == "feature"] | order(order asc){ title, description, icon },
	"about": *[_type == "about"][0]{ title, body },
	"pricing": *[_type == "pricingTier"] | order(order asc){ name, price, interval, features, highlight },
	"posts": *[_type == "post"] | order(publishedAt desc)[0...3]{ title, slug, excerpt, publishedAt }
}`;

// Blog
export const postsQuery =  groq`
*[_type == "post"] | order(_createdAt desc) {
      title,
      slug,
      body,
      mainImage { asset->{ url } },
      publishedAt,
      author->{
        name,
        image {
          asset->{url}
        }
      },
      categories[]->{
        title,
        slug
      }
    }`;
    export const postCategoryQuery = groq`*[_type == "category"]{title, slug}`
export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;
export const postBySlugQuery = groq`
*[_type == "post" && slug.current == $slug][0]{
  title,
            body,
            mainImage { asset->{ url } },
            publishedAt,
            author->{ name, image { asset->{url} } },
            metaTitle,
            metaDescription,
            highlightCta{
              headline,
              buttonText,
              buttonUrl,
            },
            ctaCard {
              headline,
              description,
              buttonText,
              buttonUrl,
            },
            relatedPosts[]->{
              title,
              slug,
              body,
              mainImage { asset->{ url } },
              publishedAt,
              author->{ name, image { asset->{url} } }
            },
            faq[]{ 
              question, 
              answer 
            } 
}
`;


// Pricing page (if separate)
export const pricingQuery = groq`*[_type == "pricingTier"] | order(order asc){ name, price, interval, features, highlight }`;


