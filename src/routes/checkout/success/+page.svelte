<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Button, Spinner } from "flowbite-svelte";
    import { onDestroy, onMount } from "svelte";
    import { CheckCircle } from "svelte-heros-v2";
    type State = "payment_in_progress" | "completed";
    let state: State = "payment_in_progress";

    let interval: ReturnType<typeof setInterval> | undefined;

    let error = false;

    onMount(() => {
        interval = setInterval(
            () =>
                fetch(
                    "/checkout/state?session=" +
                        $page.url.searchParams.get("session")
                )
                    .then(async (r) =>
                        r.ok
                            ? ((await r.json()) as { status: State })
                            : undefined
                    )
                    .then((newState) => {
                        if (!newState) {
                            error = true;
                            clearInterval(interval);
                            return;
                        }
                        state = newState.status;
                        if (state === "completed") {
                            clearInterval(interval);
                        }
                    }),
            2000
        );
    });

    onDestroy(() => {
        if (interval) {
            clearInterval(interval);
            interval = undefined;
        }
    });
</script>

<div class="min-h-screen flex justify-center">
    <div>
        <img src="/logo.svg" class="p-16 m-auto" />
        <div class="bg-amber-100 rounded-lg p-16 flex justify-center flex-col items-center w-96">
            {#if error}
                <span>An error occurred</span>
            {:else if state === "payment_in_progress"}
                <Spinner />
                <span>Waiting for payment to complete....</span>
            {:else if state === "completed"}
                <div><CheckCircle class="text-green-500" size=128/></div>
                <div class="font-bold text-gray-700 pb-4">Payment completed!</div>
                <Button on:click={(_) => goto("/home")}
                    >Go back to shopping</Button
                >
            {/if}
        </div>
    </div>
</div>
