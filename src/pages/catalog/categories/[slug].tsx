import { useRouter } from "next/router";
import { GetStaticProps, GetStaticPaths } from "next";
import { client } from "@/lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDom from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import Link from "next/link";
interface IProduct {
  id: string;
  title: string;
}

interface CategoryProps {
  category: Document;
  products: Document[];
}

export default function Category({ category, products }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map((recommendedProduct) => {
          return (
            <li key={recommendedProduct.id}>
              <Link href={`catalog/products/${recommendedProduct.uid}`}>
                <a>{recommendedProduct.data.title}</a>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map((category) => {
    return {
      params: { slug: category.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  return {
    props: {
      category,
      products: products.results,
    },
    revalidate: 60,
  };
};
