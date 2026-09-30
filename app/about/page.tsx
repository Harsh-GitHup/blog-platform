import { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us | Blog Platform",
    description: "Learn more about our blog platform and mission.",
}

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12 sm:py-20">
            <h1 className="text-4xl sm:text-5xl font-bold mb-8 text-center text-foreground">About Us</h1>
            
            <div className="prose prose-lg dark:prose-invert mx-auto">
                <p className="text-xl text-muted-foreground text-center mb-12">
                    We are a community-driven platform dedicated to sharing ideas, stories, and knowledge.
                </p>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Our mission is to provide a seamless and engaging space for writers and readers to connect. We believe that everyone has a story to tell, and our platform is designed to make publishing as effortless and beautiful as possible.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">What We Offer</h2>
                        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                            <li>A minimalist, distraction-free reading and writing experience.</li>
                            <li>A supportive community of passionate creators.</li>
                            <li>Advanced tools for formatting, categorizing, and sharing your work.</li>
                            <li>A fast, responsive, and accessible platform built with modern technologies.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-foreground mb-4">Join Us</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            Whether you're an experienced author or writing your very first post, we welcome you to join our growing community. Create an account, start writing, and share your perspective with the world.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
