import type { TransportLike } from "../core/transport";
import type {
	AppealCreateInput,
	AppealResolveInput,
	ReportCreateInput,
	ReportResolveInput,
} from "../types";

export interface ModerationReportsApiInterface {
	list: <T = unknown>() => Promise<T>;
	create: <T = unknown>(input: ReportCreateInput) => Promise<T>;
	resolve: <T = unknown>(
		reportId: string,
		input: ReportResolveInput,
	) => Promise<T>;
}

export interface ModerationAppealsApiInterface {
	list: <T = unknown>() => Promise<T>;
	create: <T = unknown>(input: AppealCreateInput) => Promise<T>;
	resolve: <T = unknown>(
		appealId: string,
		input: AppealResolveInput,
	) => Promise<T>;
}

export interface ModerationAdminApiInterface {
	disableUser: <T = unknown>(
		userId: string,
		input?: Record<string, unknown>,
	) => Promise<T>;
}

export interface ModerationApiInterface {
	reports: ModerationReportsApiInterface;
	appeals: ModerationAppealsApiInterface;
	admin: ModerationAdminApiInterface;
}

/**
 * Builds moderation helper methods for the Fake Social SDK.
 *
 * @param transport - Transport instance used for moderation requests.
 * @returns Moderation helper methods.
 */
export function createModerationApi(
	transport: TransportLike,
): ModerationApiInterface {
	return {
		reports: {
			/**
			 * Retrieves report items.
			 *
			 * @template T
			 * @returns A promise resolving to the list of reports.
			 */
			list: <T = unknown>() => transport.get<T>("/api/reports"),

			/**
			 * Creates a new report.
			 *
			 * @template T
			 * @param input - Report payload.
			 * @returns A promise resolving to the created report.
			 */
			create: <T = unknown>(input: ReportCreateInput) =>
				transport.post<T>("/api/reports", input),

			/**
			 * Resolves an existing report.
			 *
			 * @template T
			 * @param reportId - Identifier of the report.
			 * @param input - Resolution payload.
			 * @returns A promise resolving to the resolution result.
			 */
			resolve: <T = unknown>(reportId: string, input: ReportResolveInput) =>
				transport.patch<T>(
					`/api/reports/${encodeURIComponent(reportId)}`,
					input,
				),
		},
		appeals: {
			/**
			 * Retrieves appeal items.
			 *
			 * @template T
			 * @returns A promise resolving to the list of appeals.
			 */
			list: <T = unknown>() => transport.get<T>("/api/appeals"),

			/**
			 * Creates a new appeal.
			 *
			 * @template T
			 * @param input - Appeal payload.
			 * @returns A promise resolving to the created appeal.
			 */
			create: <T = unknown>(input: AppealCreateInput) =>
				transport.post<T>("/api/appeals", input),

			/**
			 * Resolves an existing appeal.
			 *
			 * @template T
			 * @param appealId - Identifier of the appeal.
			 * @param input - Resolution payload.
			 * @returns A promise resolving to the resolution result.
			 */
			resolve: <T = unknown>(appealId: string, input: AppealResolveInput) =>
				transport.patch<T>(
					`/api/appeals/${encodeURIComponent(appealId)}`,
					input,
				),
		},
		admin: {
			/**
			 * Disables a user account as an administrator.
			 *
			 * @template T
			 * @param userId - Identifier of the user to disable.
			 * @param input - Optional request payload.
			 * @returns A promise resolving to the disable result.
			 */
			disableUser: <T = unknown>(
				userId: string,
				input: Record<string, unknown> = {},
			) =>
				transport.post<T>(
					`/api/admin/users/${encodeURIComponent(userId)}/disable`,
					input,
				),
		},
	};
}
