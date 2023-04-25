import { writable, type Writable } from "svelte/store";

export const loginModalOpen = writable(false);

export const nextActionStore : Writable<undefined | {display: string, action: () => void | Promise<void>}> = writable(undefined);