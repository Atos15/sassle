<script lang="ts">
    import { Accordion, AccordionItem, Button, Modal } from "flowbite-svelte";
    import { cartStore } from "../../services/cart";
    import {ArrowRight, XMark} from 'svelte-heros-v2';
    import { user } from "../../services/auth";
    import { loginModalOpen } from "../../services/login";

    $: cart = $cartStore;
    $: userData = $user;

    const goToCheckout = async () => {
        if (!userData)
        {
            loginModalOpen.set(true);
        }else{
            const resp = await fetch('/checkout', {
                method: 'POST',
                body: JSON.stringify(cart)
            }).then(r => r.json()) as {sessionURL: string};

            cartStore.set([]);

            window.location.href = resp.sessionURL;
        }
    }

    
</script>

{#if cart.length == 0}
    <span class="text-gray-400 p-4">No items in the cart</span>
{:else}
    <Accordion flush>
        {#each cart as item}
            <AccordionItem>
                <div slot="header" class="flex justify-between w-full group">
                    <div class="flex gap-2 items-center">
                        {item.product.title}
                        <XMark
                            size="16"
                            class="invisible group-hover:visible hover:text-red-400"
                            on:click={(_) => {
                                cartStore.update((cart) =>
                                    cart.filter((i) => i.hash !== item.hash)
                                );
                            }}
                        />
                    </div>
                    <span class="text-gray-400 px-2">
                        {item.number}
                    </span>
                </div>
                <div>
                    <div class="text-gray-600 font-semibold">
                        Personalizations
                    </div>
                    <div class="grid grid-cols-2">
                        {#each item.personalizations as p}
                            <span class="font-semibold">{p.display}</span>
                            <span>{p.value}</span>
                        {/each}
                    </div>
                </div>
            </AccordionItem>
        {/each}
    </Accordion>
    <div class="mt-4">
        <Button
            class="w-full"
            gradient
            color="cyanToBlue"
            on:click={goToCheckout}
        >
            <div class="flex gap-2 items-center">
                Checkout
                <ArrowRight size="16" />
            </div>
        </Button>
    </div>
{/if}
