import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { DomainProvider } from '../../domain/DomainProvider';
import Projects from '../Projects';

describe('Projects',()=>{it('keeps project phases distinct from linked task execution',async()=>{const user=userEvent.setup();const navigate=vi.fn();render(<DomainProvider><Projects notify={vi.fn()} navigate={navigate}/></DomainProvider>);expect(screen.getByText('Desert, in a different light')).toBeVisible();await user.click(screen.getByRole('button',{name:/open desert/i}));expect(screen.getByRole('heading',{name:/Desert, in a different light/i})).toBeVisible();await user.click(screen.getByRole('tab',{name:'Files'}));expect(screen.getByText(/Treatment_v3.pdf/i)).toBeVisible();await user.click(screen.getByRole('tab',{name:'Budget'}));expect(screen.getByText(/N\$ 18,400 remaining/i)).toBeVisible();await user.click(screen.getByRole('button',{name:/open linked tasks/i}));expect(navigate).toHaveBeenCalledWith('tasks')})})
