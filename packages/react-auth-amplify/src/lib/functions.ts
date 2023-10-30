import { Auth } from 'aws-amplify';

type CognitoDefaults = {
  /**
   * @internal This is the unique identifier generated by Cognito.
   */
  readonly sub: string;
  /**
   * @internal This is managed by cognito.
   */
  readonly email_verified: boolean;
};

type DefaultUserAttributes = CognitoDefaults & {
  email?: string;
};

/**
 * @description This is the shape of the user attributes that are _returned from_ (after sign in) and _sent to_ (during sign up) Cognito. By default, it includes the `sub` and `email_verified` attributes (which are provided by Cognito). You can add your own custom attributes by augmenting this interface.
 * @see Module Augmentation: https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation
 * @example
 * declare module '@marzeelabs/react-auth-amplify' {
    export interface UserAttributes {
      // add your custom attributes here
    }
  }
 */
export interface UserAttributes extends DefaultUserAttributes {}

type FunctionOutput<TData = unknown, TError = unknown> =
  | {
      status: 'SUCCESS';
      data: TData;
      err: null;
    }
  | {
      status: 'ERROR';
      data: null;
      err: TError;
    };

type SignInInput = {
  /**
   * @description This is the username that the user will use to sign in
   * @example 'user@email.com'
   */
  username: string;
  /**
   * @description This is the password that the user will use to sign in.
   */
  password: string;
};

type SignUpInput = SignInInput & {
  /**
   * @description This is the additional attributes that you want to send to Cognito. By default, it includes the `email` attribute.
   */
  additionalAttributes?: Omit<UserAttributes, keyof DefaultUserAttributes>;
  /**
   * @description This is the flag that determines whether or not the user will be signed in after signing up.
   * @see https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#auto-sign-in-after-sign-up
   */
  autoSignIn?: boolean;
};

/**
 * @summary This is the function that you will use to sign up a user.
 * @see https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-up
 */
export async function signUp({
  password,
  username,
  additionalAttributes: attrs,
  autoSignIn = true
}: SignUpInput): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.signUp>>>
> {
  try {
    const res = await Auth.signUp({
      username,
      password,
      autoSignIn: {
        enabled: autoSignIn
      },
      attributes: attrs
    });
    return {
      status: 'SUCCESS',
      data: res,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}

type ConfirmSignUpInput = {
  username: string;
  code: string;
};

/**
 * @summary This is the function that you will use to confirm a user's sign up.
 * @see https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#confirm-sign-up
 */
export async function confirmSignUp({ username, code }: ConfirmSignUpInput) {
  try {
    const data = await Auth.confirmSignUp(username, code);
    return {
      status: 'SUCCESS',
      data,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}

/**
 * @summary This is the function that you will use to sign in a user.
 * @see https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-in
 */
export async function signIn({
  username,
  password
}: SignInInput): Promise<FunctionOutput<CognitoUser>> {
  try {
    const data: CognitoUser = await Auth.signIn(username, password);
    return {
      status: 'SUCCESS',
      data,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}

type SignOutParams = Parameters<typeof Auth.signOut>[0];

/**
 * @summary This is the function that you will use to sign out a user.
 * @see https://docs.amplify.aws/lib/auth/emailpassword/q/platform/js/#sign-out
 */
export async function signOut(
  params?: SignOutParams
): Promise<FunctionOutput<Awaited<ReturnType<typeof Auth.signOut>>>> {
  try {
    const data = await Auth.signOut(params);
    return {
      status: 'SUCCESS',
      data,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}

type ChangePasswordInput = {
  oldPassword: string;
  newPassword: string;
};

/**
 * @summary This is function allows logged in users, who already know their password to change it.
 * @see https://docs.amplify.aws/lib/auth/password_management/q/platform/js/#change-a-password-while-signed-into-their-account
 */
export async function changePassword({
  oldPassword,
  newPassword
}: ChangePasswordInput): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.changePassword>>>
> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('No user found');
    const data = await Auth.changePassword(user, oldPassword, newPassword);
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

/**
 * @summary This function allows the user to request a code to reset their password.
 * @see https://docs.amplify.aws/lib/auth/password_management/q/platform/js/#change-to-a-new-password-via-self-service
 */
export async function forgotPassword({
  username
}: {
  username: string;
}): Promise<FunctionOutput<Awaited<ReturnType<typeof Auth.forgotPassword>>>> {
  try {
    const data = await Auth.forgotPassword(username);
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

type ConfirmForgotPasswordInput = {
  username: string;
  code: string;
  newPassword: string;
};

/**
 * @summary This function allows the user to confirm their new password after requesting a code to reset their password.
 * @see https://docs.amplify.aws/lib/auth/password_management/q/platform/js/#change-to-a-new-password-after-admin-reset
 */
export async function confirmNewPasswordAfterForgotPassword({
  code,
  newPassword,
  username
}: ConfirmForgotPasswordInput): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.forgotPasswordSubmit>>>
> {
  try {
    const data = await Auth.forgotPasswordSubmit(username, code, newPassword);
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

// To initiate the process of verifying the attribute like 'phone_number' or 'email'
async function verifyCurrentUserAttribute(attr: keyof UserAttributes) {
  try {
    await Auth.verifyCurrentUserAttribute(attr);
    console.log(`a verification code is sent to verify ${attr}`);
  } catch (err) {
    console.error(
      '[verifyCurrentUserAttribute] error verifying attribute: ',
      err
    );
  }
}

/**
 * @summary This function dispatches a hub event to help identify the user's email attribute that require verification.
 * @see https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#verify-user-attributes
 */
async function requestEmailChange() {
  return await verifyCurrentUserAttribute('email');
}

/**
 * @internal This function allows the verification of an arbitrary (i.e., any) attribute. It is only meant for internal use. It is meant to be wrapped by a function that is specific to the attribute that you want to verify.
 * @example
 * async function confirmUserPhoneNumber({ verificationCode }) {
 *  return await verifyCurrentUserAttributeSubmit({
 *   attr: 'phone_number',
 *   verificationCode
 *  });
 * }
 */
async function verifyCurrentUserAttributeSubmit({
  attr,
  verificationCode
}: {
  attr: keyof UserAttributes;
  verificationCode: string;
}): Promise<
  FunctionOutput<
    Awaited<ReturnType<typeof Auth.verifyCurrentUserAttributeSubmit>>
  >
> {
  try {
    const data = await Auth.verifyCurrentUserAttributeSubmit(
      attr,
      verificationCode
    );
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

/**
 * @summary This function allows the user to verify their email address.
 * @see https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#verify-user-attributes
 */
export async function confirmUserEmail({
  verificationCode
}: {
  verificationCode: string;
}) {
  return await verifyCurrentUserAttributeSubmit({
    attr: 'email',
    verificationCode
  });
}

export type CognitoUser = Record<string, unknown> & {
  attributes: UserAttributes;
};

type CurrentAuthenticatedUserReturn = CognitoUser | undefined | null;
/**
 * @internal This function returns the currently authenticated user. It is only meant for internal use.
 */
export async function getCurrentUser(
  auth?: typeof Auth
): Promise<FunctionOutput<CurrentAuthenticatedUserReturn>> {
  try {
    const authClass = auth ?? Auth;
    const getCurrentAuthenticatedUser = authClass.currentAuthenticatedUser;
    const res: CurrentAuthenticatedUserReturn =
      await getCurrentAuthenticatedUser();
    return {
      status: 'SUCCESS',
      data: res,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}

/**
 * @summary This function updates the user's attributes.
 * @description This function will also send the user a confirmation code to verify their new email address if the email address is changed. Make sure to call the `confirmUserEmail` function to confirm the user's email address.
 * @see https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#update-user-attributes
 */
export async function updateUserAttributes(
  input: Partial<UserAttributes>
): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.updateUserAttributes>>>
> {
  try {
    const { data: user } = await getCurrentUser();
    if (!user) throw new Error('No user found');
    const result = await Auth.updateUserAttributes(user, input);
    if (input.email && input.email !== user.attributes.email) {
      await requestEmailChange();
    }
    return {
      status: 'SUCCESS',
      data: result,
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

/**
 * @summary This function deletes the user's specified attributes.
 * @see https://docs.amplify.aws/lib/auth/manageusers/q/platform/js/#delete-user-attributes
 */
export async function deleteUserAttributes(
  attrs: (keyof UserAttributes)[]
): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.deleteUserAttributes>>>
> {
  try {
    const { data: user } = await getCurrentUser();
    if (!user) throw new Error('No user found');
    const result = await Auth.deleteUserAttributes(user, attrs);
    return {
      status: 'SUCCESS',
      data: result,
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

/**
 * @summary This function deletes the currently authenticated user.
 * @see https://docs.amplify.aws/lib/auth/delete_user/q/platform/js/
 */
export async function deleteUser(): Promise<
  FunctionOutput<Awaited<ReturnType<typeof Auth.deleteUser>>>
> {
  try {
    const result = await Auth.deleteUser();
    return {
      status: 'SUCCESS',
      data: result,
      err: null
    };
  } catch (error) {
    return {
      status: 'ERROR',
      data: null,
      err: error
    };
  }
}
