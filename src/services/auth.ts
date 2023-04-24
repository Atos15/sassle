import {writable, type Writable} from 'svelte/store';

export type LoggedUser = {uid: string, email: string};
export const user : Writable<LoggedUser | undefined> = writable(undefined);

