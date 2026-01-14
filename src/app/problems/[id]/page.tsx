"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { store, Problem, Solution } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, DollarSign, CheckCircle } from "lucide-react"

export default function ProblemDetailPage() {
    const { id } = useParams()
    const { user } = useAuth()
    const router = useRouter()
    const [problem, setProblem] = useState<Problem | null>(null)
    const [existingSolution, setExistingSolution] = useState<Solution | null>(null)
    const [solutionText, setSolutionText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        if (id) {
            const p = store.getProblemById(id as string)
            setProblem(p || null)
        }
    }, [id])

    useEffect(() => {
        if (user && problem) {
            // Check if user already has a solution
            const sol = problem.solutions.find(s => s.userId === user.id)
            setExistingSolution(sol || null)
            if (sol) {
                setSolutionText(sol.content)
            }
        }
    }, [user, problem])

    const handleStart = () => {
        if (!user) return router.push('/login')
        if (user.role !== 'USER') return alert("Only Solvers can attempt problems")
        if (!problem) return

        const newSol: Solution = {
            id: `s${Date.now()}`,
            problemId: problem.id,
            userId: user.id,
            userName: user.name,
            content: "",
            status: 'IN_PROGRESS',
            submittedAt: new Date().toISOString()
        }

        store.submitSolution(newSol)
        setExistingSolution(newSol)
        // Redirect to dashboard? Or stay here.
        // Stay here to solve.
    }

    const handleSubmit = async () => {
        if (!problem || !user || !existingSolution) return

        setIsSubmitting(true)
        await new Promise(r => setTimeout(r, 800)) // Sim delay

        // Update solution (mock store handles object ref, but let's be safe if we need explicit update in real app)
        // Since it's in-memory, modifying existingSolution object works if store references it.
        // But store.submitSolution creates new entry if not exists.
        // We need updateSolutionStatus equivalent for content.
        // Store API assumes we modify the object directly in memory or we need update method.
        // Let's modify directly
        existingSolution.content = solutionText
        existingSolution.status = 'PENDING'
        existingSolution.submittedAt = new Date().toISOString()

        setIsSubmitting(false)
        // Force re-render not needed if state object mutated, but maybe?
        // Redirect to dashboard
        router.push('/user/dashboard')
    }

    if (!problem) return <div className="p-10 text-center">Loading...</div>

    return (
        <div className="container py-8 max-w-4xl space-y-8">
            <Button variant="ghost" asChild className="mb-4">
                <Link href="/problems"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Problems</Link>
            </Button>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{problem.title}</h1>
                        <div className="flex gap-2">
                            <Badge variant="outline">{problem.category}</Badge>
                            <Badge>{problem.difficulty}</Badge>
                        </div>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="whitespace-pre-wrap leading-relaxed">{problem.description}</p>
                        </CardContent>
                    </Card>

                    {/* Solution Area */}
                    {user?.role === 'USER' && (
                        <Card className={existingSolution ? "border-primary" : ""}>
                            <CardHeader>
                                <CardTitle>Your Solution</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {!existingSolution ? (
                                    <div className="text-center py-6">
                                        <p className="text-muted-foreground mb-4">Ready to take on this challenge?</p>
                                        <Button size="lg" onClick={handleStart}>Start Solving</Button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {existingSolution.status === 'IN_PROGRESS' ? (
                                            <>
                                                <Textarea
                                                    placeholder="Write your solution here (code snippet, description, link...)"
                                                    className="min-h-[200px] font-mono"
                                                    value={solutionText}
                                                    onChange={e => setSolutionText(e.target.value)}
                                                />
                                                <div className="flex justify-end">
                                                    <Button onClick={handleSubmit} disabled={isSubmitting}>
                                                        {isSubmitting ? "Submitting..." : "Submit Solution"}
                                                    </Button>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-muted p-4 rounded-md">
                                                <div className="flex items-center gap-2 mb-2 font-semibold">
                                                    Status: {existingSolution.status}
                                                    {existingSolution.status === 'ACCEPTED' && <ChecksCircle className="h-4 w-4 text-green-500" />}
                                                </div>
                                                <p className="whitespace-pre-wrap text-sm">{existingSolution.content}</p>
                                                <div className="mt-4">
                                                    <Button variant="outline" asChild>
                                                        <Link href="/user/dashboard">Go to Dashboard</Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {!user && (
                        <Card>
                            <CardContent className="py-8 text-center">
                                <p className="mb-4">Log in to start solving this problem.</p>
                                <Button asChild><Link href="/login">Log in to Solve</Link></Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className="space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader>
                            <CardTitle className="flex items-center text-primary">
                                <DollarSign className="h-5 w-5 mr-2" />
                                Bounty
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-4xl font-bold text-primary">${problem.reward}</div>
                            <p className="text-sm text-muted-foreground mt-2">Guaranteed payout upon acceptance.</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Posted By</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="font-medium">{problem.companyName}</div>
                            <div className="text-sm text-muted-foreground">Joined recently</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function ChecksCircle({ className }: { className?: string }) {
    return <CheckCircle className={className} />
}
