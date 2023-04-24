import type { UserCredential } from "firebase/auth";

export type LoggedUser = undefined | AuthenticatedUser | AnonymousUser;


export interface AuthenticatedUser{
    type: 'authenticated',
    credential: UserCredential
}

export interface AnonymousUser{
    type: 'anonymous',
    credential: UserCredential
}