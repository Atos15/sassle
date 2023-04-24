<script lang="ts">
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import { Button, Input, Label, Modal } from "flowbite-svelte";
    import { Eye, EyeSlash } from "svelte-heros-v2";
    import { createUser, loginUser } from "../../services/firebase";
    import { user } from "../../services/auth";
    import { loginModalOpen } from "../../services/login";

    $: modalOpen = $loginModalOpen;

    type State = "login" | "register";
    let state: State = "login";

    let email = "";
    let password = "";

    let showPassword = false;

    function reset(){
        email = "";
        password = "";
        showPassword = false;
    }

    function changeState(newState: State) {
        reset();
        state = newState;
    }

    async function register() {
        await createUser(email, password);
        loginModalOpen.set(false);
        reset();
    }

    async function login() {
        await loginUser(email, password);
        loginModalOpen.set(false);
        reset();
    }
</script>

<Modal bind:open={modalOpen}>
    <div class="w-96">
        {#if state === "login"}
            <h2 class="text-lg font-bold pb-4">Login</h2>
            <Label>Email</Label>
            <Input bind:value={email} type="email" autocomplete="email" />
            <Label>Password</Label>
            <Input
                type={showPassword ? "text" : "password"}
                bind:value={password}
                autocomplete="password"
            >
                <button
                    slot="left"
                    on:click={(_) => (showPassword = !showPassword)}
                    class="pointer-events-auto"
                >
                    {#if showPassword}
                        <Eye />
                    {:else}
                        <EyeSlash />
                    {/if}
                </button>
            </Input>
            <Button class="my-4 w-full" on:click={login}>Login</Button>
            <div>
                Don't have an account, click <a
                    class="text-blue-500 underline"
                    role=""
                    target="_blank"
                    on:click={(_) => changeState("register")}
                    >here to register.</a
                >
            </div>
        {:else if state === "register"}
            <h2 class="text-lg font-bold pb-4">Registration</h2>
            <Label>Email</Label>
            <Input bind:value={email} type="email" autocomplete="email" />
            <Label>Password</Label>
            <Input
                type={showPassword ? "text" : "password"}
                autocomplete="new-password"
                bind:value={password}
            >
                <button
                    slot="left"
                    on:click={(_) => (showPassword = !showPassword)}
                    class="pointer-events-auto"
                >
                    {#if showPassword}
                        <Eye />
                    {:else}
                        <EyeSlash />
                    {/if}
                </button>
            </Input>
            <Button class="my-4 w-full" on:click={register}>Register</Button>
        {/if}
    </div>
</Modal>
