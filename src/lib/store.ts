export type UserRole = 'USER' | 'COMPANY';

export interface User {
    id: string;
    name: string;
    email: string;
    role: 'USER';
    skills: string[];
    bio: string;
    earnings: number;
}

export interface Company {
    id: string;
    name: string;
    email: string;
    role: 'COMPANY';
}

export type SolutionStatus = 'IN_PROGRESS' | 'PENDING' | 'ACCEPTED' | 'REJECTED';

export interface Solution {
    id: string;
    problemId: string;
    userId: string;
    userName: string;
    content: string;
    status: SolutionStatus;
    submittedAt: string;
}

export interface Problem {
    id: string;
    companyId: string;
    companyName: string;
    title: string;
    description: string;
    category: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    reward: number;
    createdAt: string;
    status: 'OPEN' | 'CLOSED';
    solutions: Solution[];
}

// Dummy Data
const INITIAL_USERS: User[] = [
    {
        id: 'u1',
        name: 'Alice Dev',
        email: 'alice@example.com',
        role: 'USER',
        skills: ['React', 'Next.js', 'Node.js'],
        bio: 'Full stack developer looking for gigs.',
        earnings: 150,
    },
];

const INITIAL_COMPANIES: Company[] = [
    {
        id: 'c1',
        name: 'TechCorp',
        email: 'tech@example.com',
        role: 'COMPANY',
    },
];

const INITIAL_PROBLEMS: Problem[] = [
    {
        id: 'p1',
        companyId: 'c1',
        companyName: 'TechCorp',
        title: 'Fix detailed page layout bug',
        description: 'The product detail page breaks on mobile view. Needs CSS fix.',
        category: 'Coding',
        difficulty: 'Easy',
        reward: 20,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        solutions: [],
    },
    {
        id: 'p2',
        companyId: 'c1',
        companyName: 'TechCorp',
        title: 'Design Logo for new product',
        description: 'We need a modern logo for our AI tool "Nexus".',
        category: 'Design',
        difficulty: 'Medium',
        reward: 50,
        createdAt: new Date().toISOString(),
        status: 'OPEN',
        solutions: [],
    },
];

class DataStore {
    private users: User[] = INITIAL_USERS;
    private companies: Company[] = INITIAL_COMPANIES;
    private problems: Problem[] = INITIAL_PROBLEMS;

    // Auth Helpers
    findUserByEmail(email: string) {
        return this.users.find((u) => u.email === email) || this.companies.find((c) => c.email === email);
    }

    createUser(user: User) {
        this.users.push(user);
        return user;
    }

    createCompany(company: Company) {
        this.companies.push(company);
        return company;
    }

    // Problem Helpers
    getAllProblems() {
        return this.problems;
    }

    getProblemById(id: string) {
        return this.problems.find((p) => p.id === id);
    }

    createProblem(problem: Problem) {
        this.problems.push(problem);
        return problem;
    }

    // Solution Helpers
    submitSolution(solution: Solution) {
        const problem = this.getProblemById(solution.problemId);
        if (!problem) throw new Error("Problem not found");
        problem.solutions.push(solution);
        return solution;
    }

    updateSolutionStatus(problemId: string, solutionId: string, status: SolutionStatus) {
        const problem = this.getProblemById(problemId);
        if (!problem) return null;
        const solution = problem.solutions.find((s) => s.id === solutionId);
        if (!solution) return null;

        solution.status = status;

        // If accepted, add reward to user earnings
        if (status === 'ACCEPTED') {
            const user = this.users.find(u => u.id === solution.userId);
            if (user) {
                user.earnings += problem.reward;
            }
        }

        return solution;
    }

    getSolutionsForProblem(problemId: string) {
        const problem = this.getProblemById(problemId);
        return problem ? problem.solutions : [];
    }
}

export const store = new DataStore();
