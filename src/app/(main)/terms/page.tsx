'use client'
import Head from "next/head";
import React from 'react';
import Image from 'next/image';
import CustomLink from '@/components/ui/CustomLink';

const TermsPage = () => {
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
                    <title>Terms and Conditions</title>
                    <meta name="description" content="Terms and Conditions of Our Service" />
                </Head>
                <div className="max-w-3xl bg-white dark:bg-primary-800 p-8 rounded-lg shadow-md mb-10">


                    <h1 className="text-2xl font-bold mb-6">Terms and Conditions</h1>

                    <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
                    <p className="mb-4">
                        Welcome to our Terms and Conditions page. These terms govern your use of our services...
                    </p>

                    <h2 className="text-xl font-semibold mb-4">2. Acceptance of Terms</h2>
                    <p className="mb-4">
                        By accessing or using our services, you agree to be bound by these terms...
                    </p>

                    <h2 className="text-xl font-semibold mb-4">3. Modifications</h2>
                    <p className="mb-4">
                        We reserve the right to modify these terms at any time...
                    </p>


                    <CustomLink isButton={true} href={`/`}>
                        Back Home
                    </CustomLink>

                </div>
            </div>



        </div>
    );
};

export default TermsPage;
