import { render, screen } from '@testing-library/react'
import { Textarea } from '@/components/ui/textarea'

describe('Textarea component', () => {
  it('renders correctly', () => {
    render(<Textarea placeholder="Type your message" />)
    const textareaElement = screen.getByPlaceholderText(/type your message/i)
    expect(textareaElement).toBeInTheDocument()
  })

  it('handles custom className', () => {
    render(<Textarea data-testid="test-textarea" className="custom-textarea" />)
    const textareaElement = screen.getByTestId('test-textarea')
    expect(textareaElement).toHaveClass('custom-textarea')
    expect(textareaElement).toHaveClass('flex')
  })

  it('can be disabled', () => {
    render(<Textarea data-testid="test-textarea" disabled />)
    const textareaElement = screen.getByTestId('test-textarea')
    expect(textareaElement).toBeDisabled()
  })
})
