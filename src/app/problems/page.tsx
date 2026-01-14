"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { store, Problem } from "@/lib/store"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, DollarSign } from "lucide-react"

export default function ProblemsPage() {
    const [problems, setProblems] = useState<Problem[]>([])
    const [filtered, setFiltered] = useState<Problem[]>([])
    const [search, setSearch] = useState("")
    const [difficulty, setDifficulty] = useState("All")

    useEffect(() => {
        // In real app, fetch from parameters
        const all = store.getAllProblems().filter(p => p.status === 'OPEN')
        setProblems(all)
        setFiltered(all)
    }, [])

    useEffect(() => {
        let res = problems
        if (search) {
            res = res.filter(p =>
                p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.category.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (difficulty !== "All") {
            res = res.filter(p => p.difficulty === difficulty)
        }
        setFiltered(res)
    }, [search, difficulty, problems])

    return (
        <div className="container py-8 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Explore Problems</h1>
                    <p className="text-muted-foreground">Find challenges that match your skills.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or category..."
                        className="pl-8"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className="w-full sm:w-[180px]">
                    <Select value={difficulty} onValueChange={setDifficulty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="All">All Difficulties</SelectItem>
                            <SelectItem value="Easy">Easy</SelectItem>
                            <SelectItem value="Medium">Medium</SelectItem>
                            <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No problems found.
                    </div>
                ) : (
                    filtered.map(problem => (
                        <Card key={problem.id} className="flex flex-col">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant="outline">{problem.category}</Badge>
                                    <Badge variant={problem.difficulty === 'Easy' ? 'secondary' : problem.difficulty === 'Hard' ? 'destructive' : 'default'}>
                                        {problem.difficulty}
                                    </Badge>
                                </div>
                                <CardTitle className="mt-2 text-xl">{problem.title}</CardTitle>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <p className="text-muted-foreground line-clamp-3 text-sm">{problem.description}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t pt-6">
                                <div className="flex items-center text-emerald-600 font-bold">
                                    <DollarSign className="h-4 w-4 mr-1" />
                                    {problem.reward}
                                </div>
                                <Link href={`/problems/${problem.id}`}>
                                    <Button>View Details</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))
                )}
            </div>
        </div>
    )
}
