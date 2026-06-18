"use client";
import dynamic from 'next/dynamic';
const QuranPage = dynamic(() => import('@/components/pages/QuranPage'), { ssr: false });
export default function Page() { return <QuranPage />; }
