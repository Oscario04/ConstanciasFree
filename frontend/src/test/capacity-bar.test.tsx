import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CapacityBar } from '../components/ui';

describe('CapacityBar', () => {
  it('renders registered students against capacity', () => {
    render(<CapacityBar registered={62} capacity={100} />);

    expect(screen.getByText('62 de 100 estudiantes')).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument();
  });
});
