"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/auth-context"
import Link from "next/link"
import { store, Problem, Solution } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Clock, CheckCircle, XCircle } from "lucide-react"

export default function UserDashboard() {
    const { user } = useAuth()
    const [activeSolutions, setActiveSolutions] = useState<{ sol: Solution, prob: Problem }[]>([])
    const [historySolutions, setHistorySolutions] = useState<{ sol: Solution, prob: Problem }[]>([])

    useEffect(() => {
        if (user && user.role === 'USER') {
            const allProblems = store.getAllProblems();
            const mySolutions: { sol: Solution, prob: Problem }[] = [];

            allProblems.forEach(p => {
                const userSol = p.solutions.filter(s => s.userId === user.id);
                userSol.forEach(s => {
                    mySolutions.push({ sol: s, prob: p });
                });
            });

            setActiveSolutions(mySolutions.filter(x => x.sol.status === 'IN_PROGRESS' || x.sol.status === 'PENDING'));
            setHistorySolutions(mySolutions.filter(x => x.sol.status === 'ACCEPTED' || x.sol.status === 'REJECTED'));
        }
    }, [user])

    if (!user || user.role !== 'USER') {
        return <div className="p-8 text-center">Please log in as a solver.</div>
    }

    return (
        <div className="container py-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Hello, {user.name}</h1>
                    <p className="text-muted-foreground">Track your progress and earnings.</p>
                </div>
                <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/10 to-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                    <Wallet className="h-6 w-6 text-emerald-600" />
                    <div>
                        <div className="text-xs text-muted-foreground uppercase font-bold">Total Earnings</div>
                        <div className="text-xl font-bold text-emerald-600">${user.earnings}</div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Clock className="h-5 w-5" /> In Progress / Pending
                    </h2>
                    <div className="grid gap-4">
                        {activeSolutions.length === 0 ? (
                            <Card className="border-dashed">
                                <CardContent className="py-8 text-center text-muted-foreground">
                                    No active problems. <Link href="/problems" className="text-primary hover:underline">Start solving!</Link>
                                </CardContent>
                            </Card>
                        ) : (
                            activeSolutions.map(({ sol, prob }) => (
                                <Card key={sol.id}>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-base">{prob.title}</CardTitle>
                                        <div className="flex gap-2 text-xs">
                                            <Badge variant="outline">{prob.difficulty}</Badge>
                                            <Badge variant="secondary">{sol.status === 'IN_PROGRESS' ? 'In Progress' : 'Under Review'}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-sm">Reward: <span className="font-bold text-emerald-500">${prob.reward}</span></div>
                                    </CardContent>
                                    <CardFooter>
                                        <Link href={`/problems/${prob.id}`} className="w-full">
                                            <Button className="w-full" variant={sol.status === 'IN_PROGRESS' ? 'default' : 'outline'}>
                                                {sol.status === 'IN_PROGRESS' ? 'Continue Solving' : 'View Submission'}
                                            </Button>
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))
                        )}
                    </div>
                </div>

                <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" /> History
                    </h2>
                    <div className="grid gap-4">
                        {historySolutions.length === 0 ? (
                            <div className="text-muted-foreground text-sm">No history yet.</div>
                        ) : (
                            historySolutions.map(({ sol, prob }) => (
                                <Card key={sol.id} className={sol.status === 'ACCEPTED' ? 'border-green-500/20 bg-green-500/5' : ''}>
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between">
                                            <CardTitle className="text-base">{prob.title}</CardTitle>
                                            {sol.status === 'ACCEPTED' ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-destructive" />
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex justify-between items-center">
                                            <div className="text-sm text-muted-foreground">
                                                {new Date(sol.submittedAt).toLocaleDateString()}
                                            </div>
                                            <Badge variant={sol.status === 'ACCEPTED' ? 'default' : 'destructive'}>
                                                {sol.status}
                                            </Badge>
                                        </div>
                                        {sol.status === 'ACCEPTED' && (
                                            <div className="mt-2 text-xs font-bold text-green-600">
                                                + ${prob.reward} Earned
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
