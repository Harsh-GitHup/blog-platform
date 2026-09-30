import { render, screen } from '@testing-library/react'
import { Label } from '@/components/ui/label'

describe('Label component', () => {
  it('renders correctly', () => {
    render(<Label htmlFor="test-input">Test Label</Label>)
    const labelElement = screen.getByText('Test Label')
    expect(labelElement).toBeInTheDocument()
    expect(labelElement).toHaveAttribute('for', 'test-input')
  })

  it('applies peer-disabled classes properly', () => {
    render(<Label className="peer-disabled:cursor-not-allowed">Disabled Label</Label>)
    const labelElement = screen.getByText('Disabled Label')
    expect(labelElement).toHaveClass('peer-disabled:cursor-not-allowed')
  })
})
