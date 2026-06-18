"use client";
import dynamic from 'next/dynamic';
const HuroofPage = dynamic(() => import('@/components/pages/HuroofPage'), { ssr: false });
export default function Page() { return <HuroofPage />; }
