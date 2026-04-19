import type { PostItem, PostWatcherOptions } from "../types";
import type { TransportLike } from "./transport";

/**
 * Event names emitted by the PostWatcher.
 */
export type PostWatcherEvent = "new-posts";

/**
 * Listener callback invoked when new posts are detected.
 */
export type PostWatcherListener = (posts: PostItem[]) => void;

/**
 * Periodically polls the posts endpoint and emits events when new items appear.
 */
export class PostWatcher {
	private readonly transport: TransportLike;
	private readonly query?: Record<string, unknown>;
	private readonly limit: number;
	private readonly intervalMs: number;
	private readonly emitInitial: boolean;
	private readonly listeners = new Map<
		PostWatcherEvent,
		Set<PostWatcherListener>
	>();
	private readonly knownPostIds = new Set<string>();
	private timer: ReturnType<typeof setTimeout> | null = null;
	private running = false;
	private firstPollCompleted = false;

	/**
	 * @param transport - Transport instance used to fetch posts.
	 * @param options - Polling and filtering options.
	 */
	constructor(transport: TransportLike, options: PostWatcherOptions = {}) {
		this.transport = transport;
		this.query = options.query;
		this.limit = options.limit ?? 20;
		this.intervalMs = options.intervalMs ?? 15_000;
		this.emitInitial = options.initialFetch ?? false;
	}

	/**
	 * Registers a listener for watcher events.
	 */
	on(event: PostWatcherEvent, listener: PostWatcherListener): void {
		const listeners = this.listeners.get(event) ?? new Set();
		listeners.add(listener);
		this.listeners.set(event, listeners);
	}

	/**
	 * Removes a previously registered listener.
	 */
	off(event: PostWatcherEvent, listener: PostWatcherListener): void {
		const listeners = this.listeners.get(event);
		if (!listeners) {
			return;
		}
		listeners.delete(listener);
		if (listeners.size === 0) {
			this.listeners.delete(event);
		}
	}

	/**
	 * Starts polling the posts endpoint.
	 */
	start(): void {
		if (this.running) {
			return;
		}

		this.running = true;
		this.poll().catch(() => undefined);
	}

	/**
	 * Stops polling and clears any pending timer.
	 */
	stop(): void {
		this.running = false;
		if (this.timer !== null) {
			clearTimeout(this.timer);
			this.timer = null;
		}
	}

	/**
	 * Performs a polling cycle and emits events for newly discovered posts.
	 */
	async poll(): Promise<void> {
		const query = { ...this.query, limit: this.limit };
		const posts = await this.transport.get<PostItem[]>("/api/posts", { query });

		if (!Array.isArray(posts)) {
			this.scheduleNext();
			return;
		}

		const newPosts: PostItem[] = [];
		for (const post of posts) {
			const id = this.getPostId(post);
			if (!id) {
				continue;
			}

			if (!this.knownPostIds.has(id)) {
				newPosts.push(post);
			}
		}

		if (!this.firstPollCompleted) {
			this.firstPollCompleted = true;
			if (this.emitInitial && newPosts.length > 0) {
				this.emitEvent("new-posts", [...newPosts]);
			}
		} else if (newPosts.length > 0) {
			this.emitEvent("new-posts", [...newPosts]);
		}

		for (const post of newPosts) {
			const id = this.getPostId(post);
			if (id) {
				this.knownPostIds.add(id);
			}
		}

		for (const post of posts) {
			const id = this.getPostId(post);
			if (id) {
				this.knownPostIds.add(id);
			}
		}

		this.scheduleNext();
	}

	private getPostId(post: PostItem): string | undefined {
		if (typeof post._id === "string" && post._id.length > 0) {
			return post._id;
		}

		if (typeof post.id === "string" && post.id.length > 0) {
			return post.id;
		}

		return undefined;
	}

	private scheduleNext(): void {
		if (!this.running) {
			return;
		}

		this.timer = setTimeout(() => {
			this.poll().catch(() => undefined);
		}, this.intervalMs);
	}

	private emitEvent(event: PostWatcherEvent, posts: PostItem[]): void {
		const listeners = this.listeners.get(event);
		if (!listeners) {
			return;
		}

		for (const listener of listeners) {
			listener(posts);
		}
	}
}

/**
 * Creates a PostWatcher using the provided transport instance.
 *
 * @param transport - The transport implementation used for fetching posts.
 * @param options - Optional watcher configuration.
 * @returns A ready-to-use PostWatcher.
 */
export function createPostWatcher(
	transport: TransportLike,
	options: PostWatcherOptions = {},
) {
	return new PostWatcher(transport, options);
}
