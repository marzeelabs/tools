import { Hub } from 'aws-amplify';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from 'react';
import { getCurrentUser, type CognitoUser } from '../lib/functions';
import { useSetupAmplify, type SetupProps } from '../lib/setup';
import type { AuthEventType, HubEventHandler } from '../types/amplify';

type CurrentUser = CognitoUser['attributes'];

type TContext = {
  currentUser: CurrentUser | null;
};

const AuthContext = createContext<undefined | TContext>(undefined);
AuthContext.displayName = 'AuthContext';

type EventsTypes = {
  /**
   * @description Events that can be listened to. See the docs for more info.
   * @see https://docs.amplify.aws/lib/auth/auth-events/q/platform/js
   */
  events: Partial<Record<AuthEventType, HubEventHandler>>;
};

type AuthProviderProps = {
  /**
   * @description The setup object for Amplify. See the docs for more info.
   * @see https://docs.amplify.aws/lib/auth/getting-started/q/platform/js/#set-up-and-configure-amplify-auth
   * @example {
        identityPoolId: process.env.IDENTITY_POOL_ID,
        region: process.env.REGION,
        userPoolId: process.env.USER_POOL_ID,
        userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID
      }
   */
  setup: SetupProps;
} & Partial<EventsTypes>;

type Props = PropsWithChildren<AuthProviderProps>;

export function AuthProvider({ children, events, setup }: Props) {
  useSetupAmplify(setup);

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  useEffect(() => {
    if (currentUser) return;
    (async () => {
      const { data: user } = await getCurrentUser();
      if (user) setCurrentUser(user.attributes);
    })();
  }, [currentUser, setCurrentUser]);

  useEffect(() => {
    Hub.listen('auth', (data) => {
      const event: AuthEventType = data?.payload?.event;
      if (event === 'signIn') {
        const { attributes: user } = data.payload.data as CognitoUser;
        if (user && !currentUser) setCurrentUser(user);
        // run the event handler only if it's defined
        events?.signIn?.(data);
      } else if (event === 'signOut') {
        if (currentUser) setCurrentUser(null);
        // run the event handler only if it's defined
        events?.signOut?.(data);
      } else {
        if (events?.[event]) {
          console.info('[@marzeelabs/react-auth-amplify] AUTH EVENT: ', event);
          // run the event handler only if it's defined
          events?.[event]?.(data);
        }
      }
    });
  }, [events, currentUser, setCurrentUser]);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error(
      'useAuthContext must be used within an AuthProvider. Just wrap your app in one!'
    );
  return context;
}
