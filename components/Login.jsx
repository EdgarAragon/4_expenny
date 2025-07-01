'use client'

import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function Login() {
    const parmas = useSearchParams()
    const isReg = parmas.get('register')

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isRegistration, setIsRegistration] = useState(isReg)
    const [error, setError] = useState(null)
    const [authenticating, setAuthentication] = useState(false)
    const { signup, login } = useAuth()

    async function handleAuthenticate() {
        if (!email || !email.includes('@') || password.length < 6 || authenticating)
        { return }
        setError(null)
        setAuthentication(true)
        try {
            if (isRegistration) {
                //register a user
                await signup(email, password)
            } else {
                //login a user
                await login(email, password)
            }
        } catch (err) {
            console.log(err.message)
            setError(err.message)
        } finally {
            setAuthentication(false)
        }
    }

    return (
        <div className="login">
            <h2>{isRegistration ? 'Register' : 'Log in'}</h2>
            {error && (
            <div className="">
                <p>{error}</p>
            </div>
            )}
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email"/>
            <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password"/>
            <button onClick={handleAuthenticate} disabled={authenticating}>{authenticating ? 'Submitting...' : Submit}</button>
            <div className="full-line"/>
            <div>
                <p>{isRegistration ? 'Already have an account?' : 'Already have an account?'}</p>
                <button onClick={() => {
                    setIsRegistration(!isRegistration)
                }}>{isRegistration ? 'Log in' : 'Sign up'}</button>
            </div>
        </div>
    )
}