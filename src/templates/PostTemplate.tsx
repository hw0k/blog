import React, { useCallback, useMemo, useRef } from 'react';
import { graphql } from 'gatsby';
import GatsbyImage from 'gatsby-image';
import type { GatsbyImageFluidProps } from 'gatsby-image';
import { MDXProvider } from '@mdx-js/react';
import { MDXRenderer } from 'gatsby-plugin-mdx';

import Layout from './Layout';

import Tag from '../components/Tag';

import useSetupUtterances from '../hooks/useSetupUtterances';
import SEO from '../components/SEO';

interface Props {
  data: {
    mdx: {
      body: string;
      excerpt: string;
      frontmatter: {
        title: string;
        description: string | null;
        featuredImage: {
          childImageSharp: GatsbyImageFluidProps;
          publicURL: string;
        } | null;
        tags: string[];
        date: string;
      };
    };
  };
  pageContext: {
    slug: string;
  };
}

const mdxComponents = {};

function PostTemplate({ data, pageContext }: Props) {
  const {
    mdx: {
      frontmatter: { title, description, tags, date, featuredImage },
      body,
      excerpt,
    },
  } = data;
  const { slug } = pageContext;

  const ogMeta = useMemo(() => {
    const ogTags = tags ?? [];
    return [
      {
        name: 'keywords',
        content: [...ogTags, title, '남현욱', 'hw0k', '기술 블로그', 'Tech Blog'].join(','),
      },
    ];
  }, [tags, title]);

  const renderTag = useCallback((tag) => <Tag key={`${slug}_${tag}`}>{tag}</Tag>, [slug]);

  const utterancesRef = useRef<HTMLDivElement | null>(null);
  useSetupUtterances(utterancesRef);

  return (
    <Layout>
      <SEO title={title} description={description ?? excerpt} imageURL={featuredImage?.publicURL} meta={ogMeta} />
      {featuredImage && (
        <div className="mx-auto mb-8 md:mb-12 px-6 relative container flex flex-row justify-center rounded-lg md:rounded-xl">
          <GatsbyImage
            className="w-full h-auto rounded-lg md:rounded-xl"
            fluid={{ ...featuredImage.childImageSharp.fluid, aspectRatio: 21 / 9 }}
          />
        </div>
      )}
      <div className="mx-auto mb-12 px-6 w-full max-w-screen-sm">
        <h1 className="mb-2 md:mb-4 text-2xl md:text-4xl leading-normal font-extrabold">{title}</h1>
        <p className="mb-2 md:mb-4 text-xl md:text-2xl leading-normal text-gray-600">{description}</p>
        {tags && <div className="mt-2 mb-2 flex flex-row space-x-2">{tags.map(renderTag)}</div>}
        <small className="text-sm md:text-base">{date}</small>
      </div>
      <div className="mx-auto mb-12 px-6 prose md:prose-lg w-full max-w-screen-sm">
        <MDXProvider components={mdxComponents}>
          <MDXRenderer>{body}</MDXRenderer>
        </MDXProvider>
      </div>
      <div className="mx-auto px-6 container">
        <div ref={utterancesRef} />
      </div>
    </Layout>
  );
}

export const pageQuery = graphql`
  query PostQuery($slug: String!) {
    mdx(fields: { slug: { eq: $slug } }) {
      body
      excerpt(pruneLength: 100, truncate: true)
      frontmatter {
        title
        description
        date(formatString: "YYYY.MM.DD.")
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 976) {
              ...GatsbyImageSharpFluid
            }
          }
          publicURL
        }
        tags
      }
    }
  }
`;

export default PostTemplate;
