import { render, screen } from '@testing-library/react'
import { Skeleton } from '@/components/ui/skeleton'

describe('Skeleton component', () => {
  it('renders a skeleton placeholder', () => {
    render(<Skeleton data-testid="skeleton" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toBeInTheDocument()
    expect(skeleton).toHaveClass('animate-pulse')
    expect(skeleton).toHaveClass('bg-muted')
  })

  it('accepts additional class names', () => {
    render(<Skeleton data-testid="skeleton" className="w-10 h-10 rounded-full" />)
    const skeleton = screen.getByTestId('skeleton')
    expect(skeleton).toHaveClass('w-10')
    expect(skeleton).toHaveClass('h-10')
    expect(skeleton).toHaveClass('rounded-full')
  })
})
