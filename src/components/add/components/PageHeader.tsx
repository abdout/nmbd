import React from 'react';

export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <>
      <h4 className="">
        {title}
      </h4>
      {subtitle && (
        <p className='font-light'>
          {subtitle}
        </p>
      )}
    </>
  );
}
