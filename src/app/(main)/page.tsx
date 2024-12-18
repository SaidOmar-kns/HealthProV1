'use client'
import Button from '@/components/ui/Button';
import React from 'react';
import Image from 'next/image';

export default function HomePage() {


    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-900 ">
            <div className="max-w-7xl mx-auto px-5 py-10  rounded-xl ">
                <div className='flex flex-col-reverse sm:flex-row  justify-center items-start md:items-center'>
                    <div className='w-full md:w-1/2'>
                        <div className="text-3xl mb-5 font-bold">

                            <div className='text-primary-500'>Empowering</div>
                            <div>Healthcare in Kenya</div>
                            <div>with <span className='text-secondary-500'>HealthPro</span></div>
                        </div>
                        <div className='w-full md:max-w-md mb-3'>
                            Manage health professionals and facilities with ease using tibERbuHealthPro™—the all-in-one solution for quality healthcare services.
                        </div>
                        <div>
                            <Button variant='primary'>
                                Get Started
                            </Button>
                        </div>
                    </div>
                    <div className='w-full md:w-1/2'>
                        <div className='flex justify-center items-center '>
                            <div className='relative me-3 w-[200px] h-[100px] md:w-[300px] md:h-[250px]'>
                                <Image
                                    src="/home/home-1.png"
                                    alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
                                    className="object-cover object-center rounded-lg"
                                    fill
                                />

                            </div>
                            <div>
                                <div className='mb-5 relative me-3 w-[100px] md:w-[200px] h-[100px] md:h-[200px]'>
                                    <Image
                                        src="/home/home-2.png"
                                        alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
                                        fill
                                        className="object-cover object-center rounded-lg"
                                    />
                                </div>
                                <div className='relative me-3 w-[80px] md:w-[180px] h-[80px] md:h-[180px]'>
                                    <Image
                                        src="/home/home-3.png"
                                        alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
                                        fill
                                        className="object-cover object-center rounded-lg"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                </div>


            </div>
        </div>
    );
}