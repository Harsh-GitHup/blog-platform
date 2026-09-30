import { render, screen } from '@testing-library/react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

describe('Avatar component', () => {
  it('renders fallback when image is missing', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('renders the image when provided', () => {
    render(
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Test User" />
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    
    // The image should have the alt text
    const img = screen.getByAltText('Test User')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', 'https://github.com/shadcn.png')
  })
})
