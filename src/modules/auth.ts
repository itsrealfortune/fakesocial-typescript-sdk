import { AuthRoute } from "../constants/routes";
import type { TransportLike } from "../core/transport";
import type {
	AuthLoginInput,
	AuthSignupInput,
	ForgotPasswordInput,
	ResetPasswordInput,
	TotpDisableInput,
	TotpSetupInput,
	TotpVerifyInput,
} from "../types";

/**
 * Builds the authentication API helper object.
 *
 * @param transport - Transport instance used to issue auth requests.
 * @returns Authentication helper methods.
 */
export function createAuthApi(transport: TransportLike) {
	return {
		/**
		 * Signs in a user with username and password.
		 *
		 * @template T
		 * @param input - Login credentials and optional multi-factor fields.
		 * @returns A promise resolving to authentication response data.
		 */
		login: <T = unknown>(input: AuthLoginInput) =>
			transport.post<T>(AuthRoute.Login, input),

		/**
		 * Registers a new user account.
		 *
		 * @template T
		 * @param input - Signup details for the new account.
		 * @returns A promise resolving to the created user data.
		 */
		signup: <T = unknown>(input: AuthSignupInput) =>
			transport.post<T>(AuthRoute.Signup, input),

		/**
		 * Logs out the currently authenticated user.
		 *
		 * @template T
		 * @returns A promise resolving when the logout is complete.
		 */
		logout: <T = unknown>() => transport.post<T>(AuthRoute.Logout),

		/**
		 * Begins the forgot-password workflow.
		 *
		 * @template T
		 * @param input - Forgot password action payload.
		 * @returns A promise resolving to the workflow response.
		 */
		forgotPassword: <T = unknown>(input: ForgotPasswordInput) =>
			transport.post<T>(AuthRoute.ForgotPassword, input),

		/**
		 * Completes a password reset request.
		 *
		 * @template T
		 * @param input - Current and new password values.
		 * @returns A promise resolving to the reset operation result.
		 */
		resetPassword: <T = unknown>(input: ResetPasswordInput) =>
			transport.post<T>(AuthRoute.ResetPassword, input),

		/**
		 * Verifies an email address using the provided payload.
		 *
		 * @template T
		 * @param input - Verification payload.
		 * @returns A promise resolving to the verification result.
		 */
		verifyEmail: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.VerifyEmail, input),

		/**
		 * Starts TOTP setup for the current user.
		 *
		 * @template T
		 * @param input - TOTP setup credentials.
		 * @returns A promise resolving to TOTP setup data.
		 */
		totpSetup: <T = unknown>(input: TotpSetupInput) =>
			transport.post<T>(AuthRoute.TotpSetup, input),

		/**
		 * Verifies a TOTP code.
		 *
		 * @template T
		 * @param input - TOTP verification payload.
		 * @returns A promise resolving to the verification status.
		 */
		totpVerify: <T = unknown>(input: TotpVerifyInput) =>
			transport.post<T>(AuthRoute.TotpVerify, input),

		/**
		 * Disables TOTP authentication for the current account.
		 *
		 * @template T
		 * @param input - TOTP disable payload.
		 * @returns A promise resolving to the operation result.
		 */
		totpDisable: <T = unknown>(input: TotpDisableInput) =>
			transport.post<T>(AuthRoute.TotpDisable, input),

		/**
		 * Requests options needed to perform passkey authentication.
		 *
		 * @template T
		 * @param input - Passkey auth request payload.
		 * @returns A promise resolving to the passkey auth options.
		 */
		passkeyAuthOptions: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.PasskeyAuthOptions, input),

		/**
		 * Verifies the passkey authentication response.
		 *
		 * @template T
		 * @param input - Passkey verification payload.
		 * @returns A promise resolving to verification outcome.
		 */
		passkeyAuthVerify: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.PasskeyAuthVerify, input),

		/**
		 * Requests registration options for a new passkey.
		 *
		 * @template T
		 * @param input - Passkey registration request payload.
		 * @returns A promise resolving to registration options.
		 */
		passkeyRegisterOptions: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.PasskeyRegisterOptions, input),

		/**
		 * Verifies the passkey registration response.
		 *
		 * @template T
		 * @param input - Passkey registration verification payload.
		 * @returns A promise resolving to the registration result.
		 */
		passkeyRegisterVerify: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.PasskeyRegisterVerify, input),

		/**
		 * Lists passkeys registered by the current user.
		 *
		 * @template T
		 * @returns A promise resolving to the list of registered passkeys.
		 */
		passkeyList: <T = unknown>() => transport.get<T>(AuthRoute.PasskeyList),

		/**
		 * Removes a registered passkey for the current user.
		 *
		 * @template T
		 * @param input - Payload identifying the passkey to remove.
		 * @returns A promise resolving to the removal result.
		 */
		passkeyRemove: <T = unknown>(input: Record<string, unknown>) =>
			transport.post<T>(AuthRoute.PasskeyRemove, input),
	};
}
