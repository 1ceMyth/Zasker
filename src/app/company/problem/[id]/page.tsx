"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { store, Problem, Solution, SolutionStatus } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"

export default function CompanyProblemDetail() {
    const { id } = useParams()
    const { user } = useAuth()
    const router = useRouter()
    const [problem, setProblem] = useState<Problem | null>(null)

    // Force update to re-render when solutions change
    const [tick, setTick] = useState(0)

    useEffect(() => {
        if (user && id) {
            const p = store.getProblemById(id as string)
            if (p) {
                if (p.companyId !== user.id) {
                    // Unauthorized access to another company's problem
                    router.push('/company/dashboard')
                } else {
                    setProblem(p)
                }
            }
        }
    }, [user, id, tick, router])

    const handleStatusUpdate = (solutionId: string, status: SolutionStatus) => {
        if (!problem) return;
        store.updateSolutionStatus(problem.id, solutionId, status)
        setTick(t => t + 1) // Refresh UI
    }

    if (!problem) return <div className="p-10 text-center">Loading or Not Found...</div>

    return (
        <div className="container py-8 space-y-8">
            <div>
                <Button variant="ghost" onClick={() => router.back()} className="mb-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                </Button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold">{problem.title}</h1>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{problem.category}</Badge>
                            <Badge variant="outline">{problem.difficulty}</Badge>
                            <Badge variant={problem.status === 'OPEN' ? 'default' : 'secondary'}>{problem.status}</Badge>
                        </div>
                    </div>
                    <div className="text-xl font-bold text-primary">
                        Reward: ${problem.reward}
                    </div>
                </div>
                <Card className="mt-6">
                    <CardContent className="pt-6">
                        <p className="whitespace-pre-wrap">{problem.description}</p>
                    </CardContent>
                </Card>
            </div>

            <div>
                <h2 className="text-2xl font-bold mb-4">Submissions ({problem.solutions.length})</h2>
                <div className="grid gap-4">
                    {problem.solutions.length === 0 ? (
                        <div className="text-muted-foreground p-4 bg-muted/50 rounded-lg text-center">
                            No solutions submitted yet.
                        </div>
                    ) : (
                        problem.solutions.map(sol => (
                            <Card key={sol.id}>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between">
                                        <CardTitle className="text-base">{sol.userName}</CardTitle>
                                        <span className="text-xs text-muted-foreground">{new Date(sol.submittedAt).toLocaleDateString()}</span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="bg-muted p-3 rounded-md text-sm whitespace-pre-wrap">{sol.content}</p>
                                </CardContent>
                                <CardFooter className="flex justify-between pt-4">
                                    <div className="flex items-center gap-2">
                                        Status:
                                        <Badge variant={
                                            sol.status === 'ACCEPTED' ? 'default' :
                                                sol.status === 'REJECTED' ? 'destructive' : 'secondary'
                                        }>
                                            {sol.status}
                                        </Badge>
                                    </div>
                                    {sol.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <Button size="sm" variant="destructive" onClick={() => handleStatusUpdate(sol.id, 'REJECTED')}>
                                                <XCircle className="mr-2 h-4 w-4" /> Reject
                                            </Button>
                                            <Button size="sm" onClick={() => handleStatusUpdate(sol.id, 'ACCEPTED')}>
                                                <CheckCircle className="mr-2 h-4 w-4" /> Accept
                                            </Button>
                                        </div>
                                    )}
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
