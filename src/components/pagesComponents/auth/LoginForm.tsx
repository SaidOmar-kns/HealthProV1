'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FormInputComponent from '@/components/ui/FormInputComponent';

import { User, Lock, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';


export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');
        setIsLoading(true)
        try {
            await login(email, password);
        } catch (err: any) {
            // Handle different types of errors
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                const errorMessage = err.message ?? err.error;
                setError('An error occurred during login. Please try again: ' + (errorMessage ?? null));
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="h-full w-full flex justify-center items-center dark:bg-gray-900">
                <div className="grid gap-8">
                    <div
                        id="back-div"
                        className="bg-gradient-to-r from-primary-800 to-secondary-500 rounded-[26px] m-4"
                    >
                        <div
                            className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg xl:p-10 2xl:p-10 lg:p-10 md:p-10 sm:p-2 m-2"
                        >
                            <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-5xl text-center cursor-default">
                                Log in
                            </h1>
                            {error && <div className="text-red-500 mb-3">{error}</div>}
                            <form onSubmit={handleSubmit} className="space-y-5">

                                <div>
                                    <FormInputComponent
                                        id="username"
                                        name='username'
                                        placeholder="Username"
                                        value={email}
                                        type={"text"}
                                        required
                                        onChange={(e) => setEmail(e)}
                                        icon={
                                            {
                                                type: 'fontIcon' as const,
                                                content: <User className="w-5 h-5 text-gray-400" />,
                                                position: 'start' as const,
                                            }
                                        }

                                    />
                                </div>
                                <div>
                                    <FormInputComponent
                                        id="password"
                                        name='password'
                                        placeholder="Password"
                                        value={password}
                                        type="password"
                                        required
                                        onChange={(e) => setPassword(e)}
                                        icon={
                                            {
                                                type: 'fontIcon' as const,
                                                content: <Lock className="w-5 h-5 text-gray-400" />,
                                                position: 'start' as const,
                                            }
                                        }

                                    />
                                </div>
                                <a
                                    className="group text-secondary-700 transition-all duration-100 ease-in-out"
                                    href="/resetpassword"
                                >
                                    <span
                                        className="bg-left-bottom bg-gradient-to-r pt-3 text-sm from-primary-400 to-secondary-900 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                    >
                                        Forgot your password?
                                    </span>
                                </a>
                                <Button
                                    startIcon={LogIn}
                                    isLoading={isLoading}
                                    loadingText="Signing in..."
                                    type="submit"
                                >
                                    LOG IN
                                </Button>

                            </form>
                            <div
                                className="text-gray-500 flex text-center flex-col mt-4 items-center text-sm"
                            >
                                <p className="cursor-default">
                                    By signing in, you agree to our
                                    <a
                                        className="group text-blue-400 transition-all duration-100 ease-in-out mx-1"
                                        href="terms"
                                    >
                                        <span
                                            className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                        >
                                            Terms
                                        </span>
                                    </a>
                                    and
                                    <a
                                        className="group text-blue-400 transition-all duration-100 ease-in-out mx-1"
                                        href="privacy"
                                    >
                                        <span
                                            className="cursor-pointer bg-left-bottom bg-gradient-to-r from-blue-400 to-blue-400 bg-[length:0%_2px] bg-no-repeat group-hover:bg-[length:100%_2px] transition-all duration-500 ease-out"
                                        >
                                            Privacy Policy
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