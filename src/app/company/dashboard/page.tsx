"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { store, Problem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Plus, DollarSign, FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function CompanyDashboard() {
    const { user } = useAuth()
    const [problems, setProblems] = useState<Problem[]>([])

    useEffect(() => {
        if (user && user.role === 'COMPANY') {
            // In a real app we would filter by company ID.
            // For this mock store, assuming store.getAllProblems return all, we filter client side.
            // Or we add getProblemsByCompanyId to store.
            const all = store.getAllProblems()
            setProblems(all.filter(p => p.companyId === user.id))
        }
    }, [user])

    if (!user || user.role !== 'COMPANY') {
        return <div className="p-8 text-center">Please log in as a company.</div>
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Company Dashboard</h1>
                    <p className="text-muted-foreground">Manage your problem statements and review submissions.</p>
                </div>
                <Link href="/company/post">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Post New Problem
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Problems</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{problems.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active BOUNTIES</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            ${problems.reduce((acc, p) => acc + (p.status === 'OPEN' ? p.reward : 0), 0)}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-xl font-semibold mb-4">Your Posted Problems</h2>
                <div className="grid gap-4">
                    {problems.length === 0 ? (
                        <Card>
                            <CardContent className="py-8 text-center text-muted-foreground">
                                No problems posted yet.
                            </CardContent>
                        </Card>
                    ) : (
                        problems.map(problem => (
                            <Card key={problem.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle>{problem.title}</CardTitle>
                                            <CardDescription>{problem.category} • {problem.difficulty}</CardDescription>
                                        </div>
                                        <Badge variant={problem.status === 'OPEN' ? 'default' : 'secondary'}>
                                            {problem.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">{problem.description}</p>
                                    <div className="mt-2 text-sm font-medium">Reward: ${problem.reward}</div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Link href={`/company/problem/${problem.id}`}>
                                        <Button variant="outline" size="sm">View Submissions ({problem.solutions.length})</Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
