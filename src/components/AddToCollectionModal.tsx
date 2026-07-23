'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/app/lib/supabase/client"

interface TMDBMovie {
    id: number 
    title: string
    release_date: string 
    poster_path: string | null 
    overview: string 
}
 
const FORMATS = ['DVD', 'Blu-ray', '4K UHD'] as const 

export default function AddToCollectionModal({
    movie, 
    onClose,
}: {
    movie: TMDBMovie
    onClose: () => void
}) {
    const [format, setFormat] = useState<string>('Blu-ray')
    const [edition, setEdition] = useState('')
    const [isSealed, setIsSealed] = useState(false)
    const [notes, setNotes] = useState('')
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()
    const supabase = createClient()

    async function handleSave() {
        setSaving(true)
        setError(null)

        const {
            data: { user },
        } = await supabase.auth.getUser()
        
        if (!user) {
            setError("You must be logged in")
            setSaving(false)
            return
        }

        const { data: movieRow, error: movieError} = await supabase.from('movies').upsert(
            {
                tmdb_id: movie.id,
                title: movie.title,
                year: movie.release_date ? parseInt(movie.release_date.slice(0,4)) : null,
                poster_path: movie.poster_path,
                overview: movie.overview,
            },
            {onConflict: 'tmdb_id'}
        ).select().single()
        
        if (movieError || !movieRow) {
            setError(movieError?.message || 'Failed to save movie')
            setSaving(false)
            return
        }

        const {error: collectionError} = await supabase.from('collection').insert({
            user_id: user.id, 
            movie_id: movieRow.id,
            format, 
            edition: edition || null, 
            is_sealed: isSealed, 
            notes: notes || null
        })

        if (collectionError) {
            setError(collectionError.message)
            setSaving(false)
            return
        }
        
        setSaving(false)
        onClose()
        router.push('/collection')
        router.refresh()
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-black rounded-lg max-w-md w-full p-6">
                <h2 className="text-lg font-bold mb-1">{movie.title}</h2>
                <p className="text-sm text-gray-500 mb-4">
                    {movie.release_date?.slice(0,4) || 'Unknown year'}
                </p>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Format</label>
                        <select
                            value={format}
                            onChange={(e) => setFormat(e.target.value)}
                            className="w-full border rounded px-3 py-2"
                        >
                            {FORMATS.map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Edition <span className="text-gray-500">(optional)</span></label>
                        <input
                            type="text"
                            value={edition}
                            onChange={(e) => setEdition(e.target.value)}
                            placeholder="e.g. Criterion Collection, Director's Cut, Steelbook"
                            className="w-full border rounded px-3 py-2"
                        />  
                    </div>
                    <label>
                        <input
                            type="checkbox"
                            checked={isSealed}
                            onChange={(e) => setIsSealed(e.target.checked)}
                        />
                        Still sealed
                    </label>
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Notes <span className="text-gray-500">(optional)</span>
                        </label>
                        <textarea 
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={2}
                            className="w-full border rounded px-3 py-2"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm">{error}</p>}

                    <div className="flex gap-2 pt-2">
                        <button
                            onClick={onClose}
                            disabled={saving}
                            className="flex-1 border rounded px-3 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="flex-1 bg-black text-white rounded px-3 py-2 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Add to Collection'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}    
