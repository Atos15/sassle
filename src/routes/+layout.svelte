<script lang="ts">
    import { onMount } from "svelte";
    import "../app.postcss";
    import { init } from "../services/firebase";
    import { user, type LoggedUser } from "../services/auth";

    onMount(async () => {
        init();

        const uid = await fetch("/auth", { credentials: "same-origin" }).then(
            async (r) => {
                if (!r.ok) return;
                return await r.json();
            }
        ) as LoggedUser | undefined;


        console.log(uid);

        user.set(uid);
    });
</script>

<slot />
