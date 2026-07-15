import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { Card } from './Card';

describe('Card component', () => {
  const mock = {
    id: '1',
    type: 'uncontrolled' as const,
    name: 'Nina',
    email: 'testmail@gmail.com',
    age: 23,
    gender: 'female' as const,
    terms: true,
    image: 'test-image.jpg',
    country: 'Poland',
  };

  test('renders all card fields correctly', () => {
    render(<Card {...mock} />);

    expect(screen.getByText(/uncontrolled/i)).toBeInTheDocument();
    expect(screen.getByText(/Nina/i)).toBeInTheDocument();
    expect(screen.getByText(/testmail@gmail.com/i)).toBeInTheDocument();
    expect(screen.getByText(/23/i)).toBeInTheDocument();
    expect(screen.getByText(/female/i)).toBeInTheDocument();
    expect(screen.getByText(/Poland/i)).toBeInTheDocument();
  });

  test('renders image with correct src and alt', () => {
    render(<Card {...mock} />);

    const img = screen.getByRole('img');

    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'test-image.jpg');
    expect(img).toHaveAttribute('alt', 'Nina');
  });

  test('shows Yes when terms is true', () => {
    render(<Card {...mock} />);

    expect(screen.getByText(/Yes/i)).toBeInTheDocument();
  });

  test('shows No when terms is false', () => {
    render(<Card {...mock} terms={false} />);

    expect(screen.getByText(/No/i)).toBeInTheDocument();
  });

  test('applies highlight class initially', () => {
    const { container } = render(<Card {...mock} />);

    expect(container.firstChild).toHaveClass('card-new');
  });
});
