'use client'

import { useState } from "react"
import Image from "next/image"
import AddToCollectionModal from "@/components/AddToCollectionModal"

interface TMDBMovie {
    id: number 
    title: string
    release_date: string 
    poster_path: string | null 
    overview: string 
}

export default function SearchPage() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<TMDBMovie[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)

    async function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        if(!query.trim()) return

        setLoading(true)
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data.results || [])
        setLoading(false)
    }

    return (
        <div className="p-6 max-w-4xl mx-auto"> 
            <h1 className="text-2xl font-bold mb-4">Search Movies</h1>

            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a movie..."
                    className="flex-1 border rounded px-3 py-2"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white rounded px-4 py-2 disabled:opacity-50"
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {results.map((movie) => (
                    <button
                        key={movie.id}
                        onClick={() => setSelectedMovie(movie)}
                        className="text-left hover:opacity-80 transition"
                    >
                        {movie.poster_path ? (
                            <Image
                                src={`https://image.tmdb.org/t/p/w342${movie.poster_path}`}
                                alt={movie.title}
                                width={342}
                                height={513}
                                className="rounded w-full h-auto"
                            />
                        ) : (
                           <div className="bg-gray-200 aspect-[2/3] rounded flex items-center justify-content"> No Poster </div> 
                        )}

                    </button>
                ))}
            </div>
            {!loading && results.length === 0 && query && (
                <p className="text-gray-500 mt-4">No results found.</p>
            )}

            {selectedMovie && (
                <AddToCollectionModal
                    movie={selectedMovie}
                    onClose={() => setSelectedMovie(null)}
                />
            )}
        </div>
    )
}