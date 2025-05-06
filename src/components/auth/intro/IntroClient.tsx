'use client';

import dynamic from 'next/dynamic';

export default dynamic(
  () => import('@/components/auth/intro/Intro'),
  { ssr: false }
);