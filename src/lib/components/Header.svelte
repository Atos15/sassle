<script lang="ts">
    import { User, ShoppingCart } from "svelte-heros-v2";
    import { Badge, Button, Popover } from "flowbite-svelte";
    import { user } from "../../services/auth";
    import { cartStore } from "../../services/cart";
    import CheckoutMenu from "./CheckoutMenu.svelte";
    import { goto } from "$app/navigation";
    import { spring } from 'svelte/motion';

    $: cart = $cartStore;

    const offsetY = spring(0, {stiffness: 0.01, damping: 0.8});
    let bounce = false;
    cartStore.subscribe(() => {
        bounce = true;
        setTimeout(() => bounce = false, 1000)
    });
</script>

<header class="p-4 flex justify-between">
    <img
        src="/logo.svg"
        alt="logo"
        on:click={(_) => goto("/home")}
        class="cursor-pointer"
    />
    <div class="flex gap-2">
        {#if $user}
            <Button
                pill={true}
                color="light"
                class="!p-2 relative"
                id="user-button"
            >
                <User />
            </Button>
            <Popover
                triggedBy="[id='user-button']"
                class="w-96"
                placement="bottom"
                style="light"
                trigger="click"
            >
                <div class="flex flex-col items-center justify-center">
                    <span class="text-gray-600 font-semibold p-4"
                        >{$user.email}</span
                    >

                    <Button class="w-full" outline on:click={async _ => {
                        await fetch('/auth/logout', {method: 'POST'});
                        user.set(undefined);
                    }}>Logout</Button>
                </div>
            </Popover>
        {/if}
        <div>
            <Button
                pill={true}
                color="light"
                class="!p-2 relative"
                id="cart-button"
            >
                <ShoppingCart />
                <div class:hidden={cart.length == 0}>
                    <Badge rounded index color="red">{cart.length}</Badge>
                </div>
            </Button>
            <Popover
                triggedBy="[id='cart-button']"
                class="w-96"
                placement="bottom"
                style="light"
                trigger="click"
            >
                <CheckoutMenu />
            </Popover>
        </div>
    </div>
</header>
<hr class="mb-2" />
