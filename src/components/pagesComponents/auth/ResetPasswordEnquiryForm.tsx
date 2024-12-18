'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FormInputComponent from '@/components/ui/FormInputComponent';

import { LogIn, Mail } from 'lucide-react';
import Button from '@/components/ui/Button';


export default function ResetPasswordEnquiryForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
    const { resetPasswordRequest } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');
        setIsLoading(true)
        try {
            const reset: any = await resetPasswordRequest(email);
            setResponseMessage(reset.message)

        } catch (err: any) {
            // Handle different types of errors
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                const errorMessage = err.message ?? err.error;
                setError('An error occurred during password reset. Please try again: ' + (errorMessage ?? null));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="h-full w-full overflow-hidden flex justify-center items-center dark:bg-gray-900">
                <div className="grid gap-8">
                    <div
                        id="back-div"
                        className="bg-gradient-to-r from-primary-800 to-secondary-500 rounded-[26px] m-4"
                    >
                        <div
                            className="border-[20px] max-w-[400px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
                        >
                            <h3 className="pt-8 pb-6 font-bold dark:text-gray-400 text-3xl text-center cursor-default">
                                Reset your <span className="text-primary-400"> Password</span>
                            </h3>
                            <p className="pb-6 text-gray-400 dark:text-gray-200 text-center cursor-default">To reset your password, Kindly enter the email you are registered with.</p>
                            {error && <div className="text-red-500 mb-3">{error}</div>}
                            {responseMessage && <div className="text-green-500 dark:text-green-200 mb-3">{responseMessage}</div>}

                            <form onSubmit={handleSubmit} className="space-y-5">


                                <div className="w-full">
                                    <FormInputComponent
                                        id="email"
                                        name='email'
                                        placeholder="Your Email"
                                        value={email}
                                        type="email"
                                        required
                                        onChange={(e) => setEmail(e)}
                                        icon={
                                            {
                                                type: 'fontIcon' as const,
                                                content: <Mail className="w-5 h-5 text-gray-400" />,
                                                position: 'start' as const,
                                            }
                                        }

                                    />
                                </div>
                                <a
                                    className="group text-secondary-700 transition-all duration-100 ease-in-out"
                                    href="#"
                                >
                                </a>
                                <Button
                                    startIcon={LogIn}
                                    isLoading={isLoading}
                                    loadingText="Requesting..."
                                    type="submit"
                                >
                                    Reset Password
                                </Button>

                            </form>
                            <div
                                className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
                            >
                                <p className="cursor-default">
                                    <a
                                        className="group text-blue-400 transition-all duration-100 ease-in-out mx-1"
                                        href="/admin"
                                    >
                                        <span
                                            className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                        >
                                            Login
                                        </span>
                                    </a>

                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}