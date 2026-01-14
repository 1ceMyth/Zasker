"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import { store, Problem } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PostProblemPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        difficulty: 'Easy',
        reward: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user || user.role !== 'COMPANY') return;

        setLoading(true)
        // Simulate delay
        await new Promise(r => setTimeout(r, 500));

        const newProblem: Problem = {
            id: `p${Date.now()}`,
            companyId: user.id,
            companyName: user.name,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            difficulty: formData.difficulty as 'Easy' | 'Medium' | 'Hard',
            reward: Number(formData.reward) || 0,
            createdAt: new Date().toISOString(),
            status: 'OPEN',
            solutions: []
        }

        store.createProblem(newProblem)
        router.push('/company/dashboard')
        setLoading(false)
    }

    return (
        <div className="container py-10 flex justify-center">
            <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Post a New Problem</CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Problem Title</label>
                            <Input
                                placeholder="e.g., Fix CSS Grid Layout Bug"
                                required
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <Textarea
                                placeholder="Detailed description of the problem..."
                                className="min-h-[150px]"
                                required
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <Input
                                    placeholder="e.g., Frontend, Design"
                                    required
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Difficulty</label>
                                <Select
                                    value={formData.difficulty}
                                    onValueChange={val => setFormData({ ...formData, difficulty: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Easy">Easy</SelectItem>
                                        <SelectItem value="Medium">Medium</SelectItem>
                                        <SelectItem value="Hard">Hard</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Reward Amount ($)</label>
                            <Input
                                type="number"
                                placeholder="100"
                                min="5"
                                required
                                value={formData.reward}
                                onChange={e => setFormData({ ...formData, reward: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button variant="ghost" type="button" onClick={() => router.back()}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Problem'}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    )
}
