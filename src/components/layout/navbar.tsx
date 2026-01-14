"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { LogOut } from "lucide-react"

export function Navbar() {
    const { user, logout } = useAuth()

    return (
        <nav className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Zasker
                    </span>
                </Link>
                <div className="hidden md:flex gap-6">
                    <Link href="/problems" className="text-sm font-medium hover:text-primary transition-colors">
                        Explore Problems
                    </Link>
                    {user?.role === 'COMPANY' && (
                        <Link href="/company/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    )}
                    {user?.role === 'USER' && (
                        <Link href="/user/dashboard" className="text-sm font-medium hover:text-primary transition-colors">
                            My Dashboard
                        </Link>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <span className="text-sm font-medium hidden sm:inline-block">
                                {user.name}
                            </span>
                            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                            <Link href="/signup">
                                <Button size="sm">Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
