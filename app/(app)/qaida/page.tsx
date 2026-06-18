"use client";
import dynamic from 'next/dynamic';
const QaidaPage = dynamic(() => import('@/components/pages/QaidaPage'), { ssr: false });
export default function Page() { return <QaidaPage />; }
