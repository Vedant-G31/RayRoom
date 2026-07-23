const TMDB_BASE_URL = 'https://api.themoviedb.org/3'

export async function searchMovies(query: string) {
    const res = await fetch(
        `${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`,
        {
            headers: {
                Authorization: `Bearer ${process.env.TMDB_API_READ_TOKEN}`,
                accept: 'application/json',
            },
            cache: 'no-store',
        }
    )

    if (!res.ok) {
        throw new Error(`TMDB search failed: ${res.status}`)
    }

    const data = await res.json()
    const results = data.results as TMDBMovie[]

    return results
        .filter((movie) => movie.poster_path !== null)
        .filter((movie) => movie.vote_count >= 50)
        .sort((a,b) => b.vote_count - a.vote_count)
        .slice(0, 12)
}

export interface TMDBMovie {
    id: number 
    title: string
    release_date: string 
    poster_path: string | null 
    overview: string 
    popularity: number
    vote_count: number
}