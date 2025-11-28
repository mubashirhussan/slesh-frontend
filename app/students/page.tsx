import StudentsFAQ from '@/components/sections/Students/StudentsFAQ';
import StudentsHero from '@/components/sections/Students/StudentsHero';
import UseCases from '@/components/sections/Students/UseCases';
import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Slesh for Students – AI Study Assistant',
  description:
    'Slesh for Students - AI-powered study assistant to summarize lectures, analyze research papers, and automate academic tasks',
  openGraph: {
    title: 'Slesh for Students – AI Study Assistant',
    description:
      'Slesh for Students - AI-powered study assistant to summarize lectures, analyze research papers, and automate academic tasks',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/header.png',
        width: 1200,
        height: 630,
        alt: 'Slesh for Students',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Slesh for Students – AI Study Assistant',
    description:
      'Slesh for Students - AI-powered study assistant to summarize lectures, analyze research papers, and automate academic tasks',
    images: ['https://slesh.ai/header.png'],
  },
};

const StudentsPage = () => {
  return (
    <div>
      <StudentsHero />
      <UseCases />
      <StudentsFAQ />
    </div>
  );
};

export default StudentsPage;
