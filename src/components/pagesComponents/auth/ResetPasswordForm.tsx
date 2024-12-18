'use client'

import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import FormInputComponent from '@/components/ui/FormInputComponent';

import { Lock, LogIn } from 'lucide-react';
import Button from '@/components/ui/Button';
import CustomLink from '@/components/ui/CustomLink';


interface ResetPasswordFormProps {
    reset_key?: string | null | undefined;
}

const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({ reset_key }) => {
    const [confirm_password, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { resetPassword } = useAuth();
    const [resetMessage, setResetMessage] = useState('');

    const [redierction, setRedirection] = useState(false);



    const handleSubmit = async (e: React.FormEvent) => {

        e.preventDefault();
        setError('');
        setIsLoading(true)
        try {
            const reset: any = await resetPassword(password, confirm_password, reset_key);
            setResetMessage(reset.message)
            if (reset.code === 200) {
                setRedirection(true);
            }


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
                                Update your <span className="text-primary-400"> Password</span>
                            </h3>
                            {error && <div className="text-red-500 mb-3">{error}</div>}
                            {resetMessage && <div className="text-green-500 dark:text-green-200 mb-3">{resetMessage}</div>}

                            {!redierction ?
                                <div>
                                    <form onSubmit={handleSubmit} className="space-y-5">


                                        <div className="w-full">
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
                                        <div>
                                            <FormInputComponent
                                                id="confirm_password"
                                                name='confirm_password'
                                                placeholder="Confirm Password"
                                                value={confirm_password}
                                                type="password"
                                                required
                                                onChange={(e) => setConfirmPassword(e)}
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
                                            href="#"
                                        >
                                        </a>
                                        <Button
                                            startIcon={LogIn}
                                            isLoading={isLoading}
                                            loadingText="Resetting Password..."
                                            type="submit"
                                        >
                                            Reset Password
                                        </Button>

                                    </form>
                                </div> :

                                <div>
                                    <CustomLink href="/admin" isButton={true}>Login</CustomLink>
                                </div>
                            }

                        </div>
                    </div>
                </div>
            </div>
        </>

    );
}

export default ResetPasswordForm;