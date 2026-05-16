import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Badge } from '../components/ui';

describe('Badge', () => {
  it('renders status text for screen-readable state', () => {
    render(<Badge status="verified">Verificado</Badge>);
    expect(screen.getByText('Verificado')).toBeInTheDocument();
  });
});

