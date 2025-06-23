"use client";

import React, { ReactNode, useMemo, useState, useEffect, useCallback } from 'react';
import { TableCell } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import debounce from "lodash.debounce";
import Editor from './editor';

interface EditableCellProps {
    beforeInput?: ReactNode;
    id?: string
    disabled?: boolean;
    placeholder?: string;
    value: string;
    onDebouncedChange: (value: string) => void;
    className?: string;
    element?: ReactNode;
}

export const EditableCell: React.FC<EditableCellProps> = ({
    beforeInput,
    id,
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


    return (
        <TableCell id={id} className={className} style={{ padding: '0 !importants' }}>
            {beforeInput}
            <div className='flex items-center gap-2'>
                <div className='flex-1'>
                    <Editor
                        value={value}
                        onChange={onDebouncedChange}
                        disabled={disabled}
                        placeholder={placeholder}
                    />
                </div>
                {element}
            </div>
        </TableCell>
    );
}; 