'use client';

import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css'; // Import Quill styles

// Define the ref type for the RichTextEditor component
export type RichTextEditorHandle = {
    getContent: () => string;
};

interface RichTextEditorProps {
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    onMount?: () => void;
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({
    value,
    onChange,
    disabled = false,
    placeholder = 'Write something...',
    onMount
}, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        let quill: Quill | null = null;
        
        if (editorRef.current) {
            quill = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: false,
                },
                placeholder: placeholder,
                readOnly: disabled,
            });

            quillRef.current = quill;

            // Set initial value only on mount
            if (value) {
                quill.root.innerHTML = value;
            }

            // Call onMount callback after initialization
            onMount?.();
        }

        return () => {
            if (quill) {
                quill.off('text-change');
                quillRef.current = null;
            }
        };
    }, [value]); // Remove value, disabled, placeholder from dependencies

    useEffect(() => {
        const quill = quillRef.current;
        if (quill) {
            // Add text-change handler
            quill.on('text-change', () => {
                if (onChange) {
                    onChange(quill.root.innerHTML);
                }
            });
        }
    }, [onChange]);

    // Expose the getContent function to the parent component
    useImperativeHandle(ref, () => ({
        getContent: () => {
            const quill = quillRef.current;
            if (quill) {
                return quill.root.innerHTML; // Return the HTML content
            }
            return '';
        },
    }));

    return <div ref={editorRef} className='h-fit rounded-[14px] !border-none !ring-0' />;
});
RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;