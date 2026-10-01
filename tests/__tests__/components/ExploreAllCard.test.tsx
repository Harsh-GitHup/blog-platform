import { render, screen } from '@testing-library/react'
import ExploreAllCard from '@/components/ExploreAllCard'

describe('ExploreAllCard component', () => {
  it('renders the explore prompt correctly', () => {
    render(<ExploreAllCard />)
    
    // It should have a heading encouraging exploration
    expect(screen.getByText(/Explore All Articles/i)).toBeInTheDocument()
    
    // Should contain a link to the blog index
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('href', '/blog')
  })
})
