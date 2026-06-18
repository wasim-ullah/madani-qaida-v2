"use client";
import dynamic from 'next/dynamic';
const HarakatPage = dynamic(() => import('@/components/pages/HarakatPage'), { ssr: false });
export default function Page() { return <HarakatPage />; }
