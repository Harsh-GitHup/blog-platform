// app/terms/page.tsx
export const metadata = {
    title: "Terms of Service | Blogify",
    description: "Terms of Service for Blogify",
}

export default function TermsOfServicePage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-heading font-extrabold mb-8 text-foreground">Terms of Service</h1>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="lead">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <h2>1. Acceptance of Terms</h2>
                <p>
                    By accessing and using Blogify, you accept and agree to be bound by the terms and provision of this agreement. 
                    In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
                </p>

                <h2>2. User Accounts</h2>
                <p>
                    If you create an account on the platform, you are responsible for maintaining the security of your account, 
                    and you are fully responsible for all activities that occur under the account and any other actions taken in connection with it.
                    You must immediately notify us of any unauthorized uses of your account or any other breaches of security.
                </p>

                <h2>3. User Content</h2>
                <p>
                    You retain all of your ownership rights in your content, but you are required to grant us a limited license to use, store, 
                    and copy that content and to distribute and make it available to third parties. We reserve the right to remove any content 
                    that violates these Terms of Service.
                </p>

                <h2>4. Prohibited Conduct</h2>
                <p>
                    You agree not to use the service to:
                </p>
                <ul>
                    <li>Upload, post, or otherwise transmit any content that is unlawful, harmful, threatening, abusive, harassing, or defamatory.</li>
                    <li>Impersonate any person or entity, or falsely state or otherwise misrepresent your affiliation with a person or entity.</li>
                    <li>Upload, post, or otherwise transmit any material that contains software viruses or any other computer code designed to interrupt, destroy, or limit the functionality of any computer software or hardware.</li>
                </ul>

                <h2>5. Changes to Terms</h2>
                <p>
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a 
                    material change will be determined at our sole discretion. By continuing to access or use our service after those 
                    revisions become effective, you agree to be bound by the revised terms.
                </p>
            </div>
        </div>
    )
}
