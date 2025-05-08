'use client';

import dynamic from 'next/dynamic';

export default dynamic(
  () => import('@/features/auth/components/Intro'),
  { ssr: false }
);