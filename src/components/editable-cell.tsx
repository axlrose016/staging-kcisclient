"use client";

import React, { ReactNode, useMemo } from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import debounce from "lodash.debounce"; 
import Editor from './editor';
 
interface EditableCellProps {
    disabled?: boolean;
    placeholder?: string;
    value: string;
    onDebouncedChange: (value: string) => void;
    className?: string;
    element?: ReactNode;
}
 
export const EditableCell: React.FC<EditableCellProps> = ({ 
    disabled = false, 
    value, 
    onDebouncedChange, 
    className = cn(
        "align-top border-r w-full h-full bg-blue-100/40 ring-0",
        "focus:outline-none focus:ring-1"
    ), 
    placeholder = "", 
    element 
}) => {
    const debouncedChange = useMemo(
        () =>
            debounce((text: string) => {
                onDebouncedChange(text);
            }, 900),
        [onDebouncedChange]
    );

    const handleChange = (content: string) => {
        debouncedChange(content);
    };

    return (
        <TableCell className={className} style={{padding: '0 !importants'}}>
            <div className='flex items-center'>
                <div className='flex-1'>
                    <Editor 
                        value={value} 
                        onChange={handleChange}
                        disabled={disabled}
                        placeholder={placeholder}
                    />
                </div>
                {element}
            </div>
        </TableCell>
    );
}; 