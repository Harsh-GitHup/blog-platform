import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button component', () => {
  it('renders correctly with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument()
  })

  it('handles custom className', () => {
    render(<Button className="custom-class">Test</Button>)
    expect(screen.getByRole('button')).toHaveClass('custom-class')
  })
})
