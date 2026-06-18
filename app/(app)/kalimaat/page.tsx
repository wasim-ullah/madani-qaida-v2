"use client";
import dynamic from 'next/dynamic';
const KalimaatPage = dynamic(() => import('@/components/pages/KalimaatPage'), { ssr: false });
export default function Page() { return <KalimaatPage />; }
