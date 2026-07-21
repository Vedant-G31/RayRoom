import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";

export default async function CollectionPage() {
    const supabase = await createClient()
    const {data: { user }} = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return ( 
    
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text 2xl font-bold">Welcome, {user.email}</h1>
                <form action="/logout" method="post">
                    <button
                        type="submit"
                        className="border rounded px-3 py-1.5 text-sm hover:bg-gray-100"
                    >
                        Log Out
                    </button>
                </form>
            </div>
            {/* Rest of your collection page content */}
        
        </div>
    )
}