'use client'

import {useState} from 'react'
import Image from 'next/image'
import { createClient } from '@/app/lib/supabase/client'
import FormatBadge from './FormatBadge'

type Movie = {
    id: string
    tmdb_id: number 
    title: string
    year: number 
    poster_path: string | null
}

type CollectionItem = {
    id: string
    format: string 
    edition: string | null
    is_sealed: boolean
    notes: string | null 
    movies: Movie 
}

export default function CollectionGrid({initialItems,} : {initialItems: CollectionItem[]}) {
    const [items, setItems] = useState(initialItems)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const supabase = createClient()

    async function handleDelete(id:string) {
        setDeletingId(id)
        const previous = items
        setItems((curr) => curr.filter((i) => i.id !== id))

        const {error} = await supabase.from('collection').delete().eq('id', id)

        if (error) {
            console.error('Delete failed', error)
            setItems(previous)
        }
        setDeletingId(null)
    }
    if (items.length == 0) {
        return (
            <p className='text-neutral-500 mt-12 text-center'>
                Your collection is empty - search for a movie to add your first disc.
            </p>
    
    )}

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid_cols-6 gap-4'>
            {items.map((item) => (
                <div key={item.id} className='group relative bg-neutral-900 rounded-lg overflow-hidden border-solid'>
                    <div className='relative aspect-[2/3] bg-neutral-800'>
                        {item.movies.poster_path ? (
                            <Image 
                                src={`https://image.tmdb.org/t/p/w342${item.movies.poster_path}`}
                                alt={item.movies.title}
                                fill
                                className='object-cover'
                                sizes="(max-width: 768px) 50vw, 16vw"
                            />
                                ) : (
                                    <div className='flex items-center justify-center h-full text-neutral-600'>
                                        No poster
                                    </div>
                                )}

                                {item.is_sealed && (
                                    <span className='absolute top-2 left-2 bg-emerald-500/90 text-black text-[10px] font-semibold px-1.5 py-0.5 rounded'>SPAN</span>)}

                                <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    className='absolute top-2 right-2 bg-black/70 hover:bg-red-600/90 text-white text-xs w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition disabled:opacity-50'
                                    aria-label='Remove from collection'
                                >x</button>
                    </div>

                    <div className='p-2'>
                        <p className='text-sm font-medium truncate'>{item.movies.title}</p>
                        <p className='text-xs text-neutral-500 mb-1'>{item.movies.year}</p>
                        <div className='flex flex-wrap gap-1'>
                            <FormatBadge format={item.format}/>
                            {item.edition && (
                                <span className='text-xs text-neutral-500 truncate'>{item.edition}</span>
                            )}
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}