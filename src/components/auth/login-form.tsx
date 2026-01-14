"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { UserRole } from "@/lib/store"
import Link from "next/link"

export function LoginForm() {
    const router = useRouter()
    const { login } = useAuth()
    const [email, setEmail] = useState("alice@example.com") // Pre-fill for demo
    const [role, setRole] = useState<UserRole>("USER")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const result = await login(email, role)
            if (result.success) {
                if (role === 'COMPANY') {
                    router.push("/company/dashboard")
                } else {
                    router.push("/user/dashboard")
                }
            } else {
                setError(result.error || "Login failed")
            }
        } catch (err) {
            setError("An unexpected error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Welcome back</CardTitle>
                <CardDescription>
                    Login to your Zasker account
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex space-x-4 mb-4">
                        <Button
                            type="button"
                            variant={role === "USER" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setRole("USER")}
                        >
                            Solver
                        </Button>
                        <Button
                            type="button"
                            variant={role === "COMPANY" ? "default" : "outline"}
                            className="flex-1"
                            onClick={() => setRole("COMPANY")}
                        >
                            Company
                        </Button>
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Input
                            type="password"
                            placeholder="Password (any for demo)"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </Button>
                    <p className="text-sm text-center text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/signup" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    )
}
