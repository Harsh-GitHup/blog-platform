import { render, screen } from '@testing-library/react'
import PostCard from '@/components/PostCard'

// Mock Date formatting to prevent timezone test failures
jest.mock('date-fns', () => ({
  format: () => 'Jan 01, 2026',
}))

describe('PostCard component', () => {
  const mockPost = {
    id: 'test-id-123',
    title: 'Test Post Title',
    slug: 'test-post-slug',
    content: '<p>Test content snippet...</p>',
    image: '/test-image.jpg',
    publishedAt: new Date('2026-01-01T00:00:00Z'),
    createdAt: new Date('2026-01-01T00:00:00Z'),
    views: 42,
    author: {
      name: 'Test Author',
      image: null
    },
    category: {
      name: 'Technology'
    },
    _count: {
      likes: 5,
      comments: 3
    }
  }

  it('renders the post details correctly', () => {
    // @ts-ignore - only providing necessary fields for testing
    render(<PostCard post={mockPost} />)
    
    // Should have title
    expect(screen.getByText('Test Post Title')).toBeInTheDocument()
    
    // Should have author
    expect(screen.getByText('Test Author')).toBeInTheDocument()
    
    // Should have category
    expect(screen.getByText('Technology')).toBeInTheDocument()
    
    // Check link wraps the post correctly
    const links = screen.getAllByRole('link')
    expect(links.some(link => link.getAttribute('href') === '/blog/test-post-slug')).toBe(true)
  })
})
