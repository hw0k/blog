import React, { useCallback } from 'react';
import { Link } from 'gatsby';
import Image from 'gatsby-image';
import type { GatsbyImageFluidProps } from 'gatsby-image';

import Tag from './Tag';

interface Props {
  title: string;
  description: string | null;
  date: string;
  thumbnailFluid: GatsbyImageFluidProps['fluid'] | null;
  tags: string[];
  to: string;
  excerpt: string;
}

function PostItem({ to, thumbnailFluid, title, description, tags, date, excerpt }: Props) {
  const renderTag = useCallback((tag) => <Tag key={`${to}_${tag}`}>{tag}</Tag>, [to]);

  return (
    <Link className="post-item" to={to ?? '/'}>
      {thumbnailFluid && (
        <div className="mb-4 w-full h-auto relative rounded-lg overflow-hidden">
          <div className="overlay" />
          <Image
            fluid={{ ...thumbnailFluid, aspectRatio: 21 / 9 }}
            className="w-full h-auto object-cover rounded-lg"
            alt="thumbnail"
            imgStyle={{
              transition: 'transform 150ms cubic-bezier(0.4, 0, 0.2, 1), opacity 500ms ease 0s',
            }}
          />
        </div>
      )}
      <h3 className="mb-2 text-xl md:text-2xl font-bold">{title}</h3>
      <p className="mb-2">{description ?? excerpt}</p>
      {tags && <div className="mt-4 mb-2 flex flex-row space-x-2">{tags.map(renderTag)}</div>}
      <small className="text-sm text-gray-500">{date}</small>
    </Link>
  );
}

export default PostItem;
