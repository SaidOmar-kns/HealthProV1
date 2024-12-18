"use client";
import Header from '@/components/ui/Header';
interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {



    return (
        <div className="min-h-screen">
            <main className="">
                <Header />
                {children}
            </main>
        </div>
    );
}