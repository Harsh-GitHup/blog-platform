import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import LikeButton from '../../../../components/blog/LikeButton';
import { pusherClient } from '../../../../lib/pusher';
import { likePost } from '../../../../app/actions/post-interactions';
import { v4 as uuidv4 } from 'uuid';

jest.mock('../../../../lib/pusher', () => ({
  pusherClient: {
    subscribe: jest.fn(() => ({
      bind: jest.fn(),
    })),
    unsubscribe: jest.fn(),
  },
}));

jest.mock('../../../../app/actions/post-interactions', () => ({
  likePost: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('LikeButton Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Storage.prototype.getItem = jest.fn(() => 'test-session-id');
    Storage.prototype.setItem = jest.fn();
    (uuidv4 as jest.Mock).mockReturnValue('new-session-id');
  });

  it('renders correctly with initial props', () => {
    render(<LikeButton postId="123" initialLikes={5} initialIsLiked={false} />);
    
    expect(screen.getByText('Like')).toBeInTheDocument();
    expect(screen.getByText('5 likes')).toBeInTheDocument();
  });

  it('renders correctly when already liked', () => {
    render(<LikeButton postId="123" initialLikes={1} initialIsLiked={true} />);
    
    expect(screen.getByText('Liked')).toBeInTheDocument();
    expect(screen.getByText('1 like')).toBeInTheDocument();
  });

  it('handles optimistic like update', async () => {
    (likePost as jest.Mock).mockResolvedValue({ success: true });

    render(<LikeButton postId="123" initialLikes={5} initialIsLiked={false} />);
    
    const button = screen.getByRole('button');
    
    // Act
    fireEvent.click(button);
    
    // Optimistic UI updates immediately
    expect(screen.getByText('Liked')).toBeInTheDocument();
    expect(screen.getByText('6 likes')).toBeInTheDocument();
    
    await waitFor(() => {
      expect(likePost).toHaveBeenCalledWith('123', 'test-session-id');
    });
  });

  it('reverts optimistic update on failure', async () => {
    (likePost as jest.Mock).mockResolvedValue({ success: false });

    render(<LikeButton postId="123" initialLikes={5} initialIsLiked={false} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Optimistic UI updates
    expect(screen.getByText('Liked')).toBeInTheDocument();
    
    // Wait for the action to fail and revert
    await waitFor(() => {
      expect(screen.getByText('Like')).toBeInTheDocument();
      expect(screen.getByText('5 likes')).toBeInTheDocument();
    });
  });

  it('generates a new session ID if none exists in localStorage', () => {
    Storage.prototype.getItem = jest.fn(() => null);
    
    render(<LikeButton postId="123" initialLikes={5} initialIsLiked={false} />);
    
    expect(uuidv4).toHaveBeenCalled();
    expect(Storage.prototype.setItem).toHaveBeenCalledWith('anon_session_id', 'new-session-id');
  });
});
