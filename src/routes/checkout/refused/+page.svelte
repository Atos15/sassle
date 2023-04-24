<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";
    import { Button, Spinner } from "flowbite-svelte";
    import { onDestroy, onMount } from "svelte";
    import { CheckCircle, XCircle } from "svelte-heros-v2";
</script>

<div class="min-h-screen flex justify-center">
    <div>
        <img src="/logo.svg" class="p-16 m-auto" />
        <div
            class="bg-amber-100 rounded-lg p-16 flex justify-center flex-col items-center w-96"
        >
            <div><XCircle class="text-red-500" size="128" /></div>
            <div class="font-bold text-gray-700 pb-4">Payment refused</div>
            <Button on:click={(_) => goto("/home")}>Go back to shopping</Button>
        </div>
    </div>
</div>
