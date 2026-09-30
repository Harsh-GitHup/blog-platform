import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/badge'

describe('Badge component', () => {
  it('renders default badge correctly', () => {
    render(<Badge>Default</Badge>)
    const badge = screen.getByText('Default')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-primary')
  })

  it('renders destructive variant', () => {
    render(<Badge variant="destructive">Destructive</Badge>)
    const badge = screen.getByText('Destructive')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('bg-destructive')
  })

  it('renders outline variant', () => {
    render(<Badge variant="outline">Outline</Badge>)
    const badge = screen.getByText('Outline')
    expect(badge).toBeInTheDocument()
    expect(badge.className).toContain('border')
  })
})
