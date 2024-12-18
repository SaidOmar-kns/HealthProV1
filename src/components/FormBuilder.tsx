'use client'
import React from 'react';
import FormInputComponent, { IconType, InputType, SelectOption } from './ui/FormInputComponent';

export type FormFieldConfig = {
    id: string;
    name: string;
    type: InputType;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    options?: SelectOption[];
    min?: number | string;
    max?: number | string;
    step?: number;
    pattern?: string;
    autoComplete?: string;
    multiple?: boolean;
    icon?: IconType;
    className?: string;
    containerClassName?: string;
    validation?: {
        required?: boolean;
        pattern?: string;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        custom?: (value: any) => string | undefined;
    };
};

export type FormBuilderProps = {
    fields: FormFieldConfig[];
    values: Record<string, any>;
    onChange: (values: Record<string, any>) => void;
    errors?: Record<string, string>;
    className?: string;
    fieldClassName?: string;
    columns?: number; // Number of columns in the grid
};

const FormBuilder: React.FC<FormBuilderProps> = ({
    fields,
    values,
    onChange,
    errors = {},
    className = '',
    fieldClassName = '',
    columns = 12, // Default to 12-column grid for maximum flexibility
}) => {
    const handleChange = (name: string, value: any) => {
        onChange({ ...values, [name]: value });
    };

    // Default grid setup with dynamic columns
    const defaultGridClass = `grid grid-cols-${columns} gap-4`;

    return (
        <div className={`${defaultGridClass} ${className}`}>
            {fields.map((field) => (
                <div
                    key={field.id}
                    className={`${fieldClassName} ${field.containerClassName || `col-span-${columns}`}`}
                >
                    <FormInputComponent
                        {...field}
                        value={values[field.name] ?? ''}
                        onChange={(value) => handleChange(field.name, value)}
                        error={errors[field.name]}
                        className={field.className}
                    />
                </div>
            ))}
        </div>
    );
};

export default FormBuilder;