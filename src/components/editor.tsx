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
}

const RichTextEditor = forwardRef<RichTextEditorHandle, RichTextEditorProps>(({
    value,
    onChange,
    disabled = false,
    placeholder = 'Write something...'
}, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: false,
                },
                placeholder: placeholder,
                readOnly: disabled,
            });

            // Set initial value if provided
            if (value) {
                quillRef.current.root.innerHTML = value;
            }
        }

        return () => {
            if (quillRef.current) {
                quillRef.current.off('text-change');
                quillRef.current = null;
            }
        };
    }, [value, disabled, placeholder]);

    useEffect(() => {
        if (editorRef.current) {
            // Add text-change handler
            quillRef.current.on('text-change', () => {
                if (onChange && quillRef.current) {
                    onChange(quillRef.current.root.innerHTML);
                }
            });
        }
    }, [onChange])

    // Expose the getContent function to the parent component
    useImperativeHandle(ref, () => ({
        getContent: () => {
            if (quillRef.current) {
                return quillRef.current.root.innerHTML; // Return the HTML content
            }
            return '';
        },
    }));
    return <div ref={editorRef} className='h-fit rounded-[14px]' />;
});
RichTextEditor.displayName = 'RichTextEditor';
export default RichTextEditor;