'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/lib/supabase/client'


//Turn on confirm email for production.

export default function SignUpPage() {
    const [email, setEmail] = useState('') //Saves/update email as state
    const [password, setPassword] = useState('') //Saves update email as state
    const [error, setError ] = useState<string | null>(null)
    const [loading, setLoading] = useState(false) 
    const router = useRouter()
    const supabase = createClient() 

    async function handleSignup(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const { error } = await supabase.auth.signUp({ email, password})

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
            <h1 className='text-2xl font-bold mb-6'>Create your RayRoom account</h1>
            <form onSubmit={handleSignup} className='space-y-4'>
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
                    {loading ? 'Creating account...' : 'Sign up'}
                </button>
            </form>
            <p className='mt-4 text-sm'>
                Already have an account?{' '}
                <a href='/login' className='underline'>Log in</a>
            </p>
        </div>
    )

}
