import { render, screen } from '@testing-library/react'
import Footer from '@/components/Footer'

// Mock next/navigation if needed by nested components
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}))

// Mock next-auth to avoid provider errors
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({ data: null, status: 'unauthenticated' })),
}))

describe('Footer component', () => {
  it('renders footer sections correctly', () => {
    render(<Footer />)
    
    // Check main branding
    expect(screen.getByText(/Blogify/i)).toBeInTheDocument()
    
    // Check links sections exist
    expect(screen.getByText('Quick Links')).toBeInTheDocument()
    expect(screen.getByText('Legal')).toBeInTheDocument()
    
    // Check some common footer links
    expect(screen.getByRole('link', { name: /About Us/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Privacy Policy/i })).toBeInTheDocument()
    
    // Check copyright
    expect(screen.getByText(/©.*Blogify.*All rights reserved/i)).toBeInTheDocument()
  })
})
