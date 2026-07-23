import StatsBar from "@/components/StatsBar";
import { createClient } from "../lib/supabase/server";
import { redirect } from "next/navigation";
import CollectionGrid from "@/components/CollectionGrid";

export default async function CollectionPage() {
    const supabase = await createClient()
    const {data: { user }} = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const {data: collection, error} = await supabase
        .from('collection')
        .select(`
            id,
            format, 
            edition, 
            is_sealed, 
            notes, 
            movies (
                id,
                tmdb_id, 
                title,
                year, 
                poster_path
            )
        `)
        .eq('user_id', user.id).order('id', {ascending: false})

        if (error) {
            console.error('Error fetching collection:', error)
        }

        const items = (collection ?? []).map((row) => ({
            id: row.id,
            format: row.format,
            edition: row.edition, 
            is_sealed: row.is_sealed,
            notes: row.notes, 
            movies: Array.isArray(row.movies) ? row.movies[0] : row.movies,
        }))

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
            <div className="min-h-screen bg-neutral-950 text-white px-4 py-8 sm:px-8">
                <h1 className="text-3xl font-bold mb-2">My Collection</h1>
                <StatsBar items={items}/>
                <CollectionGrid initialItems={items}/>
            </div>
        
        </div>
    )
}