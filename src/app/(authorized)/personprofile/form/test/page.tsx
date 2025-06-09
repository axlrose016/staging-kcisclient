"use client";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/sessions-client"; // Client function

export default function TestPage() {
    const fetchProfiles = async () => {
        try {
            const session = await getSession();

            const response = await fetch(process.env.NEXT_PUBLIC_API_BASE_URL_KCIS + 'person_profiles/view/pages/', {
                headers: {
                    Authorization: `Bearer ${session?.token || ''}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();
            alert(response)
            if (!response.ok) {
                alert(`Error: ${data.error || 'Failed to fetch'}`);
                return;
            }

            alert(JSON.stringify(data, null, 2));
        } catch (err: any) {
            console.error(err);
            alert('Error: ' + err.message);
        }
    };

    return (
        <div className="p-4">
            <Button onClick={fetchProfiles}>Fetch Profiles</Button>
        </div>
    );
}
