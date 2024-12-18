'use client'

import ResetPasswordForm from '@/components/pagesComponents/auth/ResetPasswordForm';
import React from 'react';

export default function ResetPasswordPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {

    const reset_key = searchParams.reset_key as string;

    return (
        <div className="w-screen h-screen overflow-hidden absolute top-0 left-0 z-50">
            <ResetPasswordForm reset_key={reset_key} />
        </div>
    );
}