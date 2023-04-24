// See https://kit.svelte.dev/docs/types#app

import type { LoggedUser } from "./model/user";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: string
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
