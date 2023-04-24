<script lang="ts">
    import { goto } from "$app/navigation";
    import Header from "$lib/components/Header.svelte";

    export let data : import("./$types").PageData;
</script>

<Header/>
<div class="p-4 flex gap-2">
    {#each data.products as product}
        <button class="w-52 hover:shadow-lg rounded-b-md pointer-events-auto cursor-pointer group overflow-hidden" on:click={_ => goto('/item/' + product.id)}>
            <div class="overflow-hidden">
                <img src={product.cover} class="group-hover:scale-110 transition-[transform]"/>
            </div>
            <div class="p-2 text-sm bg-white h-16 flex items-center justify-center text-ellipsis">{product.title}</div>
        </button>
    {/each}
</div>