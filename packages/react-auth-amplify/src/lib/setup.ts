import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import type { AWSAmplifyConfig } from '../types/amplify';

type CommonProps = {
  identityPoolId: string;
  region: string;
  userPoolId: string;
  userPoolWebClientId: string;
  /**
   * This is a next.js specific option
   * @default false
   */
  ssr?: boolean;
};

type PropsWithSSR = CommonProps & {
  /**
   * @summary This should be set to the domain of the app (optional)
   * @description You should set this to the (production) domain of the app. Note: You only need to set this on production env, not on development/localhost.
   * @example '.example.com'
   * @see https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#set-up-and-configure-amplify-auth
   */
  cookieDomain?: string;
  ssr: true;
};

type PropsWithoutSSR = CommonProps & {
  cookieDomain?: undefined;
  ssr?: false;
};

export type SetupProps = PropsWithSSR | PropsWithoutSSR;

/**
 * @summary This is a hook that sets up Amplify
 */
export function useSetupAmplify({ cookieDomain, ...props }: SetupProps) {
  useEffect(() => {
    Amplify.configure({
      Auth: {
        ...props,
        cookieStorage: {
          domain: cookieDomain,
          /**
           * Although Chrome/FF allow cookies to be set on localhost, Safari does not.
           */
          secure: process.env.NODE_ENV === 'production'
        }
      }
    } satisfies AWSAmplifyConfig);
  }, []);
}
