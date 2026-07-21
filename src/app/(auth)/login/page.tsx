'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'

export default function LoginPage() {
    const [email, setEmail] = useState('') //Saves/update email as state
    const [password, setPassword] = useState('') //Saves update email as state
    const [error, setError ] = useState<string | null>(null)
    const [loading, setLoading] = useState(false) 
    const router = useRouter()
    const supabase = createClient() 

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signInWithPassword({ email, password})

        if (error) {
            setError(error.message)
            setLoading(false)
            return
        }

        router.push('/collection')
        router.refresh()
    }    

    return (
        <div className='max-w-sm mx-auto mt-20 p-6'>
            <h1 className='text-2xl font-bold mb-6'>Log in to RayRoom</h1>
            <form onSubmit={handleLogin} className='space-y-4'>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='w-full border rounded px-3 py-2'
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className='w-full border rounded px-3 py-2'
                />
                {error && <p className='text-red-600 text-sm'>{error}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className='w-full bg-black text-white rounded px-3 py-2 disabled:opacity-5'
                >
                    {loading ? 'Logging in...' : 'Log in'}
                </button>
            </form>
            <p className='mt-4 text-sm'>
                No account?{' '}
                <a href='/signup' className='underline'>Sign up</a>
            </p>
        </div>
    )

}
