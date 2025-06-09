// app/api/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/sessions-client';
import axios from 'axios';

export async function GET(req: NextRequest) {
    try {
        const session = await getSession();

        const page_number = Number(req.nextUrl.searchParams.get('page_number') || 1);
        const page_size = Number(req.nextUrl.searchParams.get('page_size') || 10);

        const response = await axios.get(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profiles/view/pages/', {
            headers: {
                Authorization: `Bearer ${session?.token || ''}`,
                "Content-Type": "application/json",
            },
            params: {
                page_number,
                page_size
            }
        });

        if (response.status !== 200) {
            return NextResponse.json({ error: response.statusText }, { status: response.status });
        }

        return NextResponse.json(response.data);

    } catch (err: any) {
        console.error('API Error:', err);
        return NextResponse.json({ error: err.message || 'Server Error' }, { status: 500 });
    }
}
