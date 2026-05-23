import { describe, it, expect } from 'vitest';
import { getRank, parseEmoticons } from '../../src/lib/kaskus';

describe('getRank', () => {
  it('returns Newbie for 0 posts', () => {
    expect(getRank(0).title).toBe('Newbie');
  });

  it('returns Kaskus Geek for 1000+ posts', () => {
    expect(getRank(1000).title).toBe('Kaskus Geek');
  });
});

describe('parseEmoticons', () => {
  it('replaces :cendol: with emoji', () => {
    expect(parseEmoticons(':cendol:')).toBe('🍵');
  });
});