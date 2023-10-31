/**
 * This file contains types for AWS Amplify. Nothing custom here.
 * At this time of writing we're using AWS Amplify v5.3.11,
 * It's currently lacking proper types and as such we took it upon ourselves to create them.
 */

import type { Auth, Hub } from 'aws-amplify';

type AuthConfig = ReturnType<typeof Auth.configure>;

/**
 * Configuration for AWS Amplify.
 */
export type AmplifyAuthConfig = {
  /**
   * Configuration for AWS Amplify Auth.
   */
  Auth: AuthConfig;
  ssr?: boolean;
};

export type AuthEventType =
  | 'configured'
  | 'signIn'
  | 'signIn_failure'
  | 'signUp'
  | 'signUp_failure'
  | 'confirmSignUp'
  | 'completeNewPassword_failure'
  | 'autoSignIn'
  | 'autoSignIn_failure'
  | 'forgotPassword'
  | 'forgotPassword_failure'
  | 'forgotPasswordSubmit'
  | 'forgotPasswordSubmit_failure'
  | 'verify'
  | 'tokenRefresh'
  | 'tokenRefresh_failure'
  | 'cognitoHostedUI'
  | 'cognitoHostedUI_failure'
  | 'customOAuthState'
  | 'customState_failure'
  | 'parsingCallbackUrl'
  | 'userDeleted'
  | 'updateUserAttributes'
  | 'updateUserAttributes_failure'
  | 'signOut'
  | (string & {});

type HubCallback = NonNullable<Parameters<typeof Hub.listen>['1']>;

type HubEventInput = Parameters<
  Extract<HubCallback, { onHubCapsule: unknown }>['onHubCapsule']
>[0];

/**
 * @description The data is coming directly to you (unmodified) from the AWS Amplify Hub. You can do whatever you want with it.
 * @see https://docs.amplify.aws/lib/auth/auth-events/q/platform/js/
 */
export type HubEventHandler = (
  data: HubEventInput
) => unknown | Promise<unknown>;
