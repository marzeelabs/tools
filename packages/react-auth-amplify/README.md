# @marzee/react-auth-amplify

> A React.js-Amplify Auth integration

`@marzee/react-auth-amplify` provides a straightforward integration for email and password authentication with AWS cognito. Optionally, it integrates with Next.js.

## Usage

1. Create a file called `lib/auth.ts` and export the following object:

```ts
import { type AmplifyAuthConfig as Config } from "@marzee/react-auth-amplify";
export const amplifyAuthConfig: Config = {
  Auth: {
    identityPoolId: process.env.IDENTITY_POOL_ID,
    region: process.env.REGION,
    userPoolId: process.env.USER_POOL_ID,
    userPoolWebClientId: process.env.USER_POOL_WEB_CLIENT_ID
  }
  ssr: true // only if you plan on using SSR (with Next.js), otherwise simply omit it.
};

```

1. Wrap your app using `AuthProvider`
  
```tsx
import { AuthProvider } from "@marzeelabs/react-auth-amplify";
import { amplifyAuthConfig } from "lib/auth";

export function AppWrapper() {
  return (
    <AuthProvider
      config={amplifyAuthConfig}
      events={{
        signIn: (data) => {
          // do what you want after the signIn event has been fired (e.g., redirect to a page)
        }
      }}>
        <App />
    </AuthProvider>
  )
}
```

3. Use the `signIn/signOut/etc...` functions in combination with your components to control the authentication flow (see [API](#api) section below for all available functions)

```tsx
import { useForm } from 'react-hook-form';
import { signIn } from '@marzeelabs/react-auth-amplify';

type Input = Parameters<typeof signIn>[0];

export const SignInComponent = () => {
  const { register, handleSubmit } = useForm<Input>();

  return (
    <form onSubmit={handleSubmit(signIn)}>
      <label htmlFor='email'>
        Email
        <input type='email' name='username' {...register('username')} />
      </label>
      <label htmlFor='password'>
        password
        <input
          type='password'
          name='password'
          autoComplete='current-password'
          {...register('password')}
        />
      </label>

      <button type='submit'>Sign In</button>
    </form>
  );
}
```

4. Get the current user using the `useAuthContext` hook

```tsx
import { useAuthContext } from '@marzeelabs/react-auth-amplify';


export const Component = () => {
  const { currentUser } = useAuthContext();
  return <div>...</div>
}

```

5. If you want to extend the type of the `currentUser` you can do so by using module augmentation

```ts
declare module '@marzeelabs/react-auth-amplify' {
  export interface UserAttributes {
    // add your custom attributes here
  }
}
```

6. If you to use this package in Next.js:
   1. you need to set the `ssr` option to `true` in the `lib/auth.ts` file (see below)
   2. Use the `getServerAuth` function to get the current user in the `getServerSideProps` function of your page

```tsx
// your other imports...
import { amplifyAuthConfig } from "lib/auth";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const currentUser = await getServerAuth({
    req: ctx.req,
    config: amplifyAuthConfig
  });
  return {
    props: {}
  };
};

// the rest of your page...
```

## API

This API provides a convenient wrapper around the AWS Amplify Auth API.
For reference see:

- <https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#add-the-sign-up-sign-in-and-sign-out-capabilities>
- <https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#pass-user-attributes-during-sign-up>
- <https://docs.amplify.aws/lib/auth/password_management/q/platform/js/>
- <https://docs.amplify.aws/lib/auth/delete_user/q/platform/js/>

The following functions are available:

| Function Name | Description |
| --- | --- |
| `signUp` | Signs up a user with AWS Cognito using the provided username, password, and user attributes. |
| `confirmSignUp` | Confirms a user's sign up with AWS Cognito using the provided username and confirmation code. |
| `signIn` | Signs in a user with AWS Cognito using the provided username and password. |
| `signOut` | Signs out the current user from AWS Cognito. |
| `changePassword` | Changes the current user's password in AWS Cognito using the provided old and new passwords. |
| `forgotPassword` | Initiates the process of resetting a user's password in AWS Cognito using the provided username. |
| `confirmNewPasswordAfterForgotPassword` | Confirms a new password for a user after they have forgotten their password in AWS Cognito using the provided confirmation code, new password, and username. |
| `confirmUserEmail` | Confirms a user's email address in AWS Cognito using the provided verification code. |
| `updateUserAttributes` | Updates the current user's attributes in AWS Cognito using the provided partial user attributes. |
| `deleteUserAttributes` | Deletes the specified attributes from the current user's attributes in AWS Cognito. |
| `deleteUser` | Deletes the current user from AWS Cognito. |
| `getServerAuth` | Returns the currently authenticated user in an SSR context. |

## Install

```sh
npm i @marzee/react-auth-amplify aws-amplify@^5
```

```sh
pnpm i @marzee/react-auth-amplify aws-amplify@^5
```

```sh
yarn i @marzee/react-auth-amplify aws-amplify@^5
```

## License

ISC
