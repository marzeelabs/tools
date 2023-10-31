import { withSSRContext, type Auth } from 'aws-amplify';
import type { GetServerSidePropsContext } from 'next';
import type { AmplifyAuthConfig } from '../types/amplify';
import { type FunctionOutput } from './functions';

type CognitoUserSSR = {
  username: string;
} & Record<string, unknown>;

type CurrentAuthenticatedUserReturnSSR = CognitoUserSSR | undefined | null;

type Params = {
  req: GetServerSidePropsContext['req'];
  config: AmplifyAuthConfig;
};
/**
 * @summary This is a next.js specific option, it is to be used ONLY inside `getServerSideProps`
 * @description In SSR, Amplify creates a new instance scoped/per-request, and as such you must auth config every time you want to get the current user on the server side.
 * @see https://docs.amplify.aws/lib/ssr/q/platform/js/#withssrcontext
 */
export async function getServerAuth({
  req,
  config
}: Params): Promise<FunctionOutput<CurrentAuthenticatedUserReturnSSR>> {
  if (!config) throw new Error('No config provided for getServerAuth');
  const Amplify = withSSRContext({ req });
  Amplify.configure(config);
  const auth: typeof Auth = Amplify.Auth;
  try {
    const data: CurrentAuthenticatedUserReturnSSR =
      await auth.currentAuthenticatedUser();
    return {
      status: 'SUCCESS',
      data,
      err: null
    };
  } catch (err) {
    return {
      status: 'ERROR',
      data: null,
      err
    };
  }
}
