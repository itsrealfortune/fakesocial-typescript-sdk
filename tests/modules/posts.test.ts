import { describe, expect, it } from 'bun:test';
import { createPostWatcher } from '../../src/core/postWatcher';
import type { TransportLike } from '../../src/core/transport';
import type { PostItem } from '../../src/types';

const makeTransport = (responses: PostItem[][]): TransportLike => {
  let call = 0;
  return {
    buildUrl: () => '',
    delete: async () => ({} as unknown as any),
    get: async () => {
      const response = responses[call] ?? [];
      call += 1;
      return response as unknown as any;
    },
    patch: async () => ({} as unknown as any),
    post: async () => ({} as unknown as any),
    put: async () => ({} as unknown as any),
    request: async () => ({} as unknown as any),
    setToken: () => {},
  } as unknown as TransportLike;
};

describe('createPostWatcher', () => {
  it('emits new posts only after the first baseline poll when initialFetch is false', async () => {
    const responses = [
      [{ _id: '1', title: 'first' }, { _id: '2', title: 'second' }],
      [{ _id: '1', title: 'first' }, { _id: '2', title: 'second' }],
      [{ _id: '1', title: 'first' }, { _id: '2', title: 'second' }, { _id: '3', title: 'third' }],
    ];
    const watcher = createPostWatcher(makeTransport(responses));
    const events: PostItem[][] = [];

    watcher.on('new-posts', (posts) => {
      events.push(posts);
    });

    await watcher.poll();
    expect(events).toEqual([]);

    await watcher.poll();
    expect(events).toEqual([]);

    await watcher.poll();
    expect(events).toEqual([[{ _id: '3', title: 'third' }]]);
  });

  it('emits the first batch when initialFetch is true', async () => {
    const responses = [[{ _id: '10', title: 'hello' }]];
    const watcher = createPostWatcher(makeTransport(responses), { initialFetch: true });
    const events: PostItem[][] = [];

    watcher.on('new-posts', (posts) => {
      events.push(posts);
    });

    await watcher.poll();
    expect(events).toEqual([[{ _id: '10', title: 'hello' }]]);
  });
});
