import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input component', () => {
  it('renders correctly', () => {
    render(<Input placeholder="Enter text" />)
    const inputElement = screen.getByPlaceholderText(/enter text/i)
    expect(inputElement).toBeInTheDocument()
  })

  it('applies custom classes along with default classes', () => {
    render(<Input data-testid="test-input" className="my-custom-class" />)
    const inputElement = screen.getByTestId('test-input')
    expect(inputElement).toHaveClass('my-custom-class')
    expect(inputElement).toHaveClass('flex')
  })

  it('can be disabled', () => {
    render(<Input data-testid="test-input" disabled />)
    const inputElement = screen.getByTestId('test-input')
    expect(inputElement).toBeDisabled()
  })
})
