import { searchMovies } from "@/app/lib/tmdb/client"

export async function GET(request: Request) {
    const {searchParams} = new URL(request.url)
    const query = searchParams.get('q')

    if (!query || query.trim().length === 0) {
        return Response.json({ results:[]})
    }

    try {
        const results = await searchMovies(query)
        return Response.json({ results })
    } catch (error) {
        return Response.json({error: 'Search failed'}, {status: 500})
    }
}