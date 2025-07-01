'use client'

import { usePathname } from "next/navigation"
import Link from "next/link"
import { UseAuth } from "@/context/AuthContext"

export default function GoTo() {
    const { currentUser, logout } = UseAuth()

    const isAuthenticated = !!currentUser

    const path = usePathname()

    return (
        <div className="goto">
            {path == '/' && (
            <>
                <Link href={'/dashboard?register=true'}>
                <p>Sign-up</p>
                </Link>
                <Link href={'/dashboard'}>
                    <button>Login &rarr;</button>
                </Link>
            </>
            )}
            {(isAuthenticated && path == '/dashboard') && (
                <button onClick={logout}>Logout</button>
            )}
        </div>
    )
}