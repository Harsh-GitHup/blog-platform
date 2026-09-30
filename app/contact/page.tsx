import { Metadata } from "next"
import { Mail, MapPin, Phone } from "lucide-react"

export const metadata: Metadata = {
    title: "Contact Us | Blog Platform",
    description: "Get in touch with the Blog Platform team.",
}

export default function ContactPage() {
    return (
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-20">
            <div className="text-center mb-16">
                <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">Contact Us</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">We'd love to hear from you. Please fill out the form below or reach out via email.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
                {/* Contact Information */}
                <div>
                    <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
                    <p className="text-muted-foreground mb-8 leading-relaxed">
                        Have a question, feedback, or need support? Our team is here to help. Reach out to us using the contact details below or send a message directly.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-muted-foreground group">
                            <div className="bg-primary/10 p-4 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Email</p>
                                <a href="mailto:support@blogify.com" className="hover:text-primary transition-colors">support@blogify.com</a>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground group">
                            <div className="bg-primary/10 p-4 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Office</p>
                                <p>123 Writing Street, Tech City, 10011</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 text-muted-foreground group">
                            <div className="bg-primary/10 p-4 rounded-full text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-semibold text-foreground">Phone</p>
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-card border rounded-2xl p-6 sm:p-8 shadow-lg">
                    <form className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium mb-2 text-foreground">Name</label>
                            <input 
                                type="text" 
                                id="name" 
                                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Your Name"
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium mb-2 text-foreground">Email</label>
                            <input 
                                type="email" 
                                id="email" 
                                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="your@email.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="message" className="block text-sm font-medium mb-2 text-foreground">Message</label>
                            <textarea 
                                id="message" 
                                rows={5}
                                className="w-full p-3 rounded-lg border bg-background focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                placeholder="How can we help you?"
                            />
                        </div>

                        <button 
                            type="button" 
                            className="w-full py-3 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg transition-colors"
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
