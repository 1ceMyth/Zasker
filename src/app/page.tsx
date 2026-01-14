import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      <section className="flex-1 flex flex-col items-center justify-center space-y-10 py-24 text-center md:py-32 lg:py-40 bg-gradient-to-b from-background to-muted/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
              Solve Problems. <span className="text-primary">Earn Rewards.</span>
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Zasker connects companies with top talent to solve real-world challenges.
              Post a problem or start solving today.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="h-12 px-8">
                  Get Started
                </Button>
              </Link>
              <Link href="/problems">
                <Button size="lg" variant="outline" className="h-12 px-8">
                  Explore Problems
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-20 px-4 md:px-6">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col space-y-4">
            <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
            </div>
            <h3 className="text-xl font-bold">For Companies</h3>
            <p className="text-muted-foreground">Post your challenges and set a bounty. Review solutions from a global pool of talent.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            </div>
            <h3 className="text-xl font-bold">For Solvers</h3>
            <p className="text-muted-foreground">Browse problems by difficulty and category. Submit your solution and get paid.</p>
          </div>
          <div className="flex flex-col space-y-4">
            <div className="p-3 w-fit rounded-lg bg-primary/10 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
            </div>
            <h3 className="text-xl font-bold">Secure Rewards</h3>
            <p className="text-muted-foreground">Payouts are guaranteed upon acceptance. Build your portfolio and reputation.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
