import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/dom';
import { component$ } from '@builder.io/qwik';
import ConversationList from '../../src/components/qwik/ConversationList';

describe('ConversationList', () => {
  it('renders "Anda belum memiliki percakapan" when no conversations', async () => {
    render(<ConversationList conversations={[]} />);
    expect(screen.getByText('Anda belum memiliki percakapan.')).toBeTruthy();
  });
});