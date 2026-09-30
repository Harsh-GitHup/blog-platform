// app/privacy/page.tsx
export const metadata = {
    title: "Privacy Policy | Blogify",
    description: "Privacy Policy for Blogify",
}

export default function PrivacyPolicyPage() {
    return (
        <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-heading font-extrabold mb-8 text-foreground">Privacy Policy</h1>
            
            <div className="prose prose-neutral dark:prose-invert max-w-none">
                <p className="lead">
                    Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                <h2>1. Introduction</h2>
                <p>
                    Welcome to Blogify. We respect your privacy and are committed to protecting your personal data. 
                    This privacy policy will inform you as to how we look after your personal data when you visit our website 
                    and tell you about your privacy rights.
                </p>

                <h2>2. Data We Collect</h2>
                <p>
                    We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
                </p>
                <ul>
                    <li><strong>Identity Data</strong> includes first name, last name, username, and profile image.</li>
                    <li><strong>Contact Data</strong> includes email address.</li>
                    <li><strong>Technical Data</strong> includes internet protocol (IP) address, your login data, browser type and version.</li>
                </ul>

                <h2>3. How We Use Your Data</h2>
                <p>
                    We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
                </p>
                <ul>
                    <li>Where we need to perform the contract we are about to enter into or have entered into with you (e.g., managing your account).</li>
                    <li>Where it is necessary for our legitimate interests and your interests and fundamental rights do not override those interests.</li>
                </ul>

                <h2>4. Data Security</h2>
                <p>
                    We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used, or accessed in an unauthorized way, altered, or disclosed.
                    For example, all passwords are encrypted and hashed before being stored in our database.
                </p>

                <h2>5. Contact Us</h2>
                <p>
                    If you have any questions about this privacy policy or our privacy practices, please contact us.
                </p>
            </div>
        </div>
    )
}
