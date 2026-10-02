import { render, screen, fireEvent, act } from '@testing-library/react';
import BlogSearch from '../../../components/BlogSearch';
import { useRouter, useSearchParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}));

describe('BlogSearch Component', () => {
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key) => null),
      toString: jest.fn(() => ''),
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const categories = [
    { id: 'cat1', name: 'Technology' },
    { id: 'cat2', name: 'Lifestyle' }
  ];

  it('renders search input and category buttons', () => {
    render(<BlogSearch categories={categories} />);
    
    expect(screen.getByPlaceholderText('Search articles...')).toBeInTheDocument();
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Lifestyle')).toBeInTheDocument();
  });

  it('updates query and pushes to router after debounce', async () => {
    render(<BlogSearch categories={categories} />);
    
    const input = screen.getByPlaceholderText('Search articles...');
    fireEvent.change(input, { target: { value: 'nextjs' } });
    
    expect(input).toHaveValue('nextjs');
    expect(pushMock).not.toHaveBeenCalled(); // due to debounce

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(pushMock).toHaveBeenCalledWith('/blog?q=nextjs');
  });

  it('handles category change and pushes to router immediately', () => {
    render(<BlogSearch categories={categories} />);
    
    const techButton = screen.getByText('Technology');
    fireEvent.click(techButton);

    expect(pushMock).toHaveBeenCalledWith('/blog?category=Technology');
  });

  it('handles "All" category correctly by clearing category param', () => {
    (useSearchParams as jest.Mock).mockReturnValue({
      get: jest.fn((key) => key === 'category' ? 'Technology' : null),
      toString: jest.fn(() => 'category=Technology'),
    });

    render(<BlogSearch categories={categories} />);
    
    const allButton = screen.getByText('All');
    fireEvent.click(allButton);

    expect(pushMock).toHaveBeenCalledWith('/blog?');
  });
});
