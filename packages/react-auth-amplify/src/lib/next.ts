import { withSSRContext, type Auth } from 'aws-amplify';
import type { GetServerSidePropsContext } from 'next';
import { getCurrentUser } from './functions';

/**
 * @description This is a next.js specific option, it is to be used ONLY inside `getServerSideProps`
 */
export async function getServerAuth(ctx: GetServerSidePropsContext) {
  const amplify = withSSRContext({ req: ctx.req });
  const auth: typeof Auth = amplify.Auth;
  return await getCurrentUser(auth);
}
