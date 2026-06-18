"use client";
import dynamic from 'next/dynamic';
const ProgressPage = dynamic(() => import('@/components/pages/ProgressPage'), { ssr: false });
export default function Page() { return <ProgressPage />; }
