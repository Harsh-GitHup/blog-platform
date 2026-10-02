import { render, screen } from '@testing-library/react';
import { FooterDashboardLink } from '../../../components/FooterDashboardLink';
import { useSession } from 'next-auth/react';

jest.mock('next-auth/react');

describe('FooterDashboardLink Component', () => {
    it('renders dashboard link when session is present', () => {
        (useSession as jest.Mock).mockReturnValue({
            data: { user: { username: 'johndoe' } },
            status: 'authenticated'
        });

        render(<FooterDashboardLink />);
        const link = screen.getByRole('link', { name: /dashboard/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/johndoe');
    });

    it('returns null when there is no session', () => {
        (useSession as jest.Mock).mockReturnValue({
            data: null,
            status: 'unauthenticated'
        });

        const { container } = render(<FooterDashboardLink />);
        expect(container.firstChild).toBeNull();
    });
});
