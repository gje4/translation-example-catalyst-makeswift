import { getFormatter } from 'next-intl/server';

import { graphql, ResultOf } from '~/client/graphql';
import { ProductCard as ComponentProductCard } from '~/components/ui/product-card';
import { pricesTransformer } from '~/data-transformers/prices-transformer';

import { AddToCart } from './add-to-cart';
import { AddToCartFragment } from './add-to-cart/fragment';
import {removeEdgesAndNodes} from "@bigcommerce/catalyst-client";

export const PricingFragment = graphql(`
  fragment PricingFragment on Product {
    prices {
      price {
        value
        currencyCode
      }
      basePrice {
        value
        currencyCode
      }
      retailPrice {
        value
        currencyCode
      }
      salePrice {
        value
        currencyCode
      }
      priceRange {
        min {
          value
          currencyCode
        }
        max {
          value
          currencyCode
        }
      }
    }
  }
`);

export const ProductCardFragment = graphql(
  `
    fragment ProductCardFragment on Product {
      entityId
      name
      defaultImage {
        altText
        url: urlTemplate
      }
      path
      brand {
        name
        path
      }
      customFields {
          edges {
              node {
                  name
                  value
              }
          }
      }
      reviewSummary {
        numberOfReviews
        averageRating
      }
      ...AddToCartFragment
      ...PricingFragment
    }
  `,
  [AddToCartFragment, PricingFragment],
);

interface Props {
  product: ResultOf<typeof ProductCardFragment>;
  imageSize?: 'tall' | 'wide' | 'square';
  imagePriority?: boolean;
  showCompare?: boolean;
  showCart?: boolean;
}

export const ProductCard = async ({
  product,
  imageSize = 'square',
  imagePriority = false,
  showCart = true,
  showCompare = true,
}: Props) => {
  const format = await getFormatter();

  const { name, entityId, defaultImage, brand, path, prices, customFields } = product;

  const price = pricesTransformer(prices, format);
  const custFields = customFields ? removeEdgesAndNodes(customFields) : [];

  return (
      <ComponentProductCard
          addToCart={showCart && <AddToCart data={product} />}
          href={path}
          id={entityId.toString()}
          image={defaultImage ? { src: defaultImage.url, altText: defaultImage.altText } : undefined}
          imagePriority={imagePriority}
          imageSize={imageSize}
          name={name}
          price={price}
          basePrice={prices?.basePrice}
          showCompare={showCompare}
          subtitle={brand?.name}
          customFields={custFields}
      />
  );
};
