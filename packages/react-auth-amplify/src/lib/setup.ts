import { Amplify } from 'aws-amplify';
import { useEffect } from 'react';
import type { AmplifyAuthConfig } from '../types/amplify';

/**
 * @summary This is a hook that sets up Amplify
 */
export function useSetupAmplify(config: AmplifyAuthConfig) {
  useEffect(() => {
    if (!config) throw new Error('Missing Amplify config for client-side');
    Amplify.configure(config);
  }, []);
}
