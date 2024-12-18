'use client'
import Head from "next/head";
import React from 'react';
import Image from 'next/image';
import CustomLink from '@/components/ui/CustomLink';

const RegulatorsPage = () => {
    return (
        <div className="min-h-screen items-center justify-center bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200">
            <div className="text-center">
                <div className='flex items-center justify-center'>
                    <Image
                        src="/logo.png" // Replace with your logo path
                        alt="Logo"
                        width={350}
                        height={150}
                        className="w-auto"
                    />
                </div>
                <h1 className="mb-10 font-bold text-2xl">Welcome to {process.env.NEXT_PUBLIC_APP_NAME}</h1>
            </div>
            <div className="flex w-full  items-center justify-center">
                <Head>
                    <title>Privacy Policy</title>
                    <meta name="description" content="Privacy Policy of Our Service" />
                </Head>
                <div className="max-w-3xl bg-white dark:bg-primary-800 p-8 rounded-lg shadow-md mb-10">
                    <h1 className="text-2xl font-bold mb-6">Privacy Policy</h1>

                    <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        This Privacy Policy explains how we collect, use, and protect your personal information...
                    </p>

                    <h2 className="text-xl font-semibold mb-4">2. Information We Collect</h2>
                    <p className="mb-4">
                        We may collect the following types of information:
                    </p>
                    <ul className="list-disc ml-6 mb-4">
                        <li>Personal identification information (e.g., name, email address)</li>
                        <li>Usage data (e.g., how you use our services)</li>
                    </ul>

                    <h2 className="text-xl font-semibold mb-4">3. How We Use Your Information</h2>
                    <p className="mb-4">
                        We use the information we collect for various purposes, including:
                    </p>
                    <ul className="list-disc ml-6 mb-4">
                        <li>To provide and maintain our services</li>
                        <li>To notify you about changes to our services</li>
                    </ul>

                    <h2 className="text-xl font-semibold mb-4">4. Data Security</h2>
                    <p className="mb-4">
                        We take the security of your personal information seriously and implement appropriate measures...
                    </p>

                    <h2 className="text-xl font-semibold mb-4">5. Changes to This Privacy Policy</h2>
                    <p className="mb-4">
                        We may update our Privacy Policy from time to time. We will notify you of any changes...
                    </p>

                    <CustomLink isButton={true} href={`/`}>
                        Back Home
                    </CustomLink>

                </div>
            </div>



        </div>
    );
};

export default RegulatorsPage;
