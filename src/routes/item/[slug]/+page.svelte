<script lang="ts">
    import Konva from "konva";
    import {
        Label,
        Input,
        NumberInput,
        Button,
        Accordion,
        AccordionItem,
        Toast,
    } from "flowbite-svelte";
    import { onMount } from "svelte";
    import type { Product } from "../../../model/product";
    import { user } from "../../../services/auth";
    import { addToCart, cartStore } from "../../../services/cart";
    import Login from "$lib/components/Login.svelte";
    import Header from "$lib/components/Header.svelte";
    import type { Personalization } from "../../../model/personalization";
    import { ShoppingBag } from "svelte-heros-v2";
    export let data: import("./$types").PageData;

    const choises = data.views
        ? Object.entries(data.views)
              .sort((a, b) => a[1].order - b[1].order)
              .map((v) => ({
                  name: v[0],
                  thumb: v[1].preview,
                  preview: v[1].detail,
                  bounds: v[1].bounds,
              }))
        : [];

    let index = 0;

    let qty = 1;

    $: choosen = choises[index];

    $: cart = $cartStore;

    let personalizations = structuredClone(
        data.personalizations
    ) as Product["personalizations"];

    $: selectorStyle = (idx: number) => {
        if (index == idx)
            return "cursor-pointer mb-2 rounded-md border-2 border-blue-500";
        return "cursor-pointer mb-2 rounded-md hover:border-2 hover:border-red-400 border-2 border-transparent";
    };

    function formatCurrency(currency: number) {
        const integerPart = Math.floor(currency / 100);
        const fractionalPart = currency - integerPart * 100;
        return integerPart + "." + fractionalPart;
    }

    let preview: HTMLDivElement;
    let container: HTMLDivElement;
    let stage: Konva.Stage;
    let texts: {
        text: Konva.Text;
        selector: Konva.Transformer;
        pers: (typeof personalizations)[number];
        update: () => void;
    }[] = [];

    let selected = -1;

    function select(newIndex: number) {
        if (selected >= 0) {
            texts[selected].selector.visible(false);
        }

        if (newIndex >= 0) {
            texts[newIndex].selector.visible(true);
        }

        selected = newIndex;
    }

    $: pageConfig = choosen?.bounds ?? { x: 0, y: 0, w: 1, h: 1 };

    let pageBounds: Konva.Rect;

    $: if (stage && choosen) {
        stage.width(width);
        stage.height((width * imageHeight) / imageWidth);
        texts.forEach(
            (t) =>
                t.text.x(t.pers.x * stage.width()) &&
                t.text.y(t.pers.y * stage.height()) &&
                t.text.fontSize((t.pers.fontSize * width) / imageWidth)
        );

        pageBounds.x(pageConfig.x * stage.width());
        pageBounds.y(pageConfig.y * stage.height());
        pageBounds.width(pageConfig.w * stage.width());
        pageBounds.height(pageConfig.h * stage.height());
    }

    onMount(() => {
        stage = new Konva.Stage({
            container,
            width: width,
            height: (width * imageHeight) / imageWidth,
        });
        stage.destroyChildren();
        texts = [];
        const layer = new Konva.Layer();
        stage.add(layer);

        pageBounds = new Konva.Rect({
            x: pageConfig.x * stage.width(),
            y: pageConfig.y * stage.height(),
            width: pageConfig.w * stage.width(),
            height: pageConfig.h * stage.height(),
            stroke: "red",
            dashEnabled: true,
            dash: [10, 10],
            opacity: 0.1,
            visible: false,
        });

        stage.on("pointerup", (e) => {
            const x = e.evt.clientX - preview.getBoundingClientRect().x;
            const y = e.evt.clientY - preview.getBoundingClientRect().y;
            console.log(x / stage.width(), y / stage.height());
        });

        layer.add(pageBounds);

        for (let i = 0; i < personalizations.length; i++) {
            const p = personalizations[i];

            const tr = new Konva.Transformer({
                enabledAnchors: [
                    "top-left",
                    "top-right",
                    "bottom-left",
                    "bottom-right",
                ],
                visible: false,
            });
            const text = new Konva.Text({
                text: p.value,
                x: p.x * stage.width(),
                y: p.y * stage.height(),
                fontSize: (p.fontSize * width) / imageWidth,
                draggable: true,
            });

            const ensureBounds = () => {
                text.x(Math.max(text.x(), pageBounds.x()));
                text.x(
                    Math.min(
                        text.x() + text.width() * text.scaleX(),
                        pageBounds.x() + pageBounds.width()
                    ) -
                        text.width() * text.scaleX()
                );
                text.y(Math.max(text.y(), pageBounds.y()));
                text.y(
                    Math.min(
                        text.y() + text.height() * text.scaleY(),
                        pageBounds.y() + pageBounds.height()
                    ) -
                        text.height() * text.scaleY()
                );

                personalizations[i].x = text.x() / stage.width();
                personalizations[i].y = text.y() / stage.height();
            };

            text.on("dragmove transformend", (_) => {
                ensureBounds();
            });
            text.on("pointerup", (_) => {
                select(selected == i ? -1 : i);
            });
            text.on("dragstart", (_) => {
                select(i);
                pageBounds.visible(true);
            });
            text.on("dragend", (_) => {
                pageBounds.visible(false);
            });
            texts.push({ text, selector: tr, pers: p, update: ensureBounds });
            tr.nodes([text]);
            layer.add(text);
            layer.add(tr);
        }
    });

    $: imageWidth > 1 &&
        stage &&
        pageBounds &&
        personalizations.forEach(
            (p, i) =>
                texts[i].pers.view === choosen.name &&
                texts[i].text.text(p.value) &&
                texts[i].update()
        );

    $: texts.forEach((t) => {
        t.text.visible(choosen.name === t.pers.view);
        if (t.selector.isVisible() && t.pers.view !== choosen.name)
            t.selector.visible(false);
    });

    let toastTimeout : ReturnType<typeof setTimeout> | undefined;

    async function convertAndAdd() {
        const personalizations: Personalization[] = texts.map((t) => ({
            type: t.pers.type,
            value: t.pers.value,
            display: t.pers.display,
            x: t.text.x() / stage.width(),
            y: t.text.y() / stage.height(),
            scaleX: t.text.scaleX(),
            scaleY: t.text.scaleY(),
            angle: t.selector.rotation(),
        }));

        toastOpen = true;
        if (toastTimeout){
            clearTimeout(toastTimeout)
            toastTimeout = undefined;
        }
        toastTimeout = setTimeout(() => {
            toastOpen = false;
        }, 3000);
        await addToCart(cart, data, qty, personalizations);
    }

    let width = 0;
    let imageWidth = 1;
    let imageHeight = 1;
    let toastOpen = false;
</script>

<Header />
<div class="grid grid-cols-[100px_2fr_1fr] font-sans">
    <div class="view-selector p-2">
        {#each choises as choise, idx}
            <button on:click={(_) => (index = idx)} class="block">
                <img class={selectorStyle(idx)} src={choise.thumb} />
            </button>
        {/each}
    </div>
    <div
        class="view-preview border-oran relative"
        bind:this={preview}
        bind:offsetWidth={width}
    >
        <div class="absolute top-0 left-0" bind:this={container} />

        <img
            class="w-full"
            src={choosen.preview}
            bind:naturalWidth={imageWidth}
            bind:naturalHeight={imageHeight}
        />
    </div>
    <div class="p-4">
        <span class="block">by {data.by}</span>
        <span class="block text-xl py-1">{data.title}</span>
        <span class="font-semibold text-xl text-gray-600"
            >${formatCurrency(data.pricePerUnit * qty)}</span
        >
        <span class="font-semibold text-md line-through text-gray-400"
            >${formatCurrency(data.pricePerUnitBeforeDiscount * qty)}</span
        >
        <div class="flex">
            <div class="flex items-center">
                <Label class="p-4">Qty</Label>
                <NumberInput bind:value={qty} class="!w-16" />
            </div>
            <Button
                color="yellow"
                class="text-black !font-bold !bg-yellow-300 hover:!bg-yellow-400 w-full !mx-2"
                on:click={convertAndAdd}>Add to Cart</Button
            >
        </div>
        <Accordion flush>
            <AccordionItem>
                <span slot="header">Personalize</span>
                {#each personalizations as p}
                    <div>
                        <Label class="mb-2">{p.display}</Label>
                        <Input
                            class="mb-2"
                            bind:value={p.value}
                            on:input={(_) =>
                                (personalizations = personalizations)}
                        />
                    </div>
                {/each}
            </AccordionItem>
        </Accordion>
    </div>
</div>
<Toast open={toastOpen} class="m-4 fixed bottom-0 right-0">
    <svelte:fragment slot="icon">
        <ShoppingBag/>
    </svelte:fragment>
    {qty} x {data.title} added to the shopping cart
</Toast>
<Login />
