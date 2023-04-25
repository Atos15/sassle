<script lang="ts">
    import { createUserWithEmailAndPassword } from "firebase/auth";
    import {
        Button,
        CloseButton,
        Helper,
        Input,
        Label,
        Modal,
    } from "flowbite-svelte";
    import { Eye, EyeSlash } from "svelte-heros-v2";
    import { createUser, loginUser } from "../../services/firebase";
    import { user } from "../../services/auth";
    import { loginModalOpen, nextActionStore } from "../../services/login";

    $: modalOpen = $loginModalOpen;

    $: loginModalOpen.set(modalOpen);
    $: nextAction = $nextActionStore;

    type State = "login" | "register";
    let state: State = "login";

    let email = "";
    let password = "";

    let showPassword = false;

    let error = false;
    let errorMessage = "";

    let logginIn = false;

    function reset() {
        email = "";
        password = "";
        showPassword = false;
        error = false;
        logginIn = false;
    }

    function changeState(newState: State) {
        reset();
        state = newState;
    }

    async function register() {
        try {
            logginIn = true;
            await createUser(email, password);
            if (nextAction) {
                await nextAction.action();
                nextActionStore.set(undefined);
            }
        } catch (err) {
            errorMessage = "An unknown error occurred";
            if (err instanceof Object && "code" in err) {
                const code = err.code;
                switch (code) {
                    case "auth/invalid-email":
                        errorMessage = "Please enter a valid e-mail";
                        break;
                    case "auth/weak-password":
                        errorMessage = "Please enter a stronger password";
                        break;
                    case "auth/email-already-in-use":
                        errorMessage =
                            email +
                            " is already used by someone else, please choose another email";
                        break;
                    case "auth/missing-password":
                        errorMessage = "Please enter a password";
                        break;
                    case "auth/missing-email":
                        errorMessage = "Please enter an email";
                        break;
                }
            }
            error = true;
            return;
        } finally {
            logginIn = false;
        }
        loginModalOpen.set(false);
        reset();
    }

    async function login() {
        try {
            logginIn = true;
            const user = await loginUser(email, password);
            if (!user) throw new Error("Could not login");
            if (nextAction) {
                await nextAction.action();
                nextActionStore.set(undefined);
            }
        } catch (err) {
            error = true;
            errorMessage = "An unknown error occurred";
            if (err instanceof Object && "code" in err) {
                const code = err.code;
                console.log(code);
                switch (code) {
                    case "auth/invalid-email":
                        errorMessage = "Please enter a valid e-mail";
                        break;
                    case "auth/wrong-password":
                    case "auth/user-not-found":
                        errorMessage = "Wrong username or password";
                        break;
                    case "auth/missing-password":
                        errorMessage = "Please enter a password";
                        break;
                    case "auth/missing-email":
                        errorMessage = "Please enter an email";
                        break;
                }
            }
            return;
        } finally {
            logginIn = false;
        }
        loginModalOpen.set(false);
        reset();
    }
</script>

<Modal bind:open={modalOpen} permanent>
    <div class="w-[80vw] md:w-96">
        <div class="absolute top-0 right-0 m-4">
            <CloseButton
                tabindex="4"
                on:click={(_) => {
                    loginModalOpen.set(false);
                    reset();

                    nextActionStore.set(undefined);
                }}
            />
        </div>
        <div class={state === "login" ? "" : "hidden"}>
            <h2 class="text-lg font-bold pb-4">Login</h2>
            <Label>Email</Label>
            <Input
                tabindex="0"
                bind:value={email}
                type="email"
                autocomplete="email"
            />
            <Label>Password</Label>
            <Input
                tabindex="1"
                type={showPassword ? "text" : "password"}
                bind:value={password}
                autocomplete="password"
            >
                <button
                    tabindex="-1"
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
            <Helper class={"mt-2 " + (error ? "" : "invisible")} color="red"
                ><span class="font-medium">{errorMessage}</span></Helper
            >
            <Button
                taabindex="2"
                class="my-4 w-full"
                on:click={login}
                disabled={logginIn}
                >Login {nextAction ? " & " + nextAction.display : ""}</Button
            >
            <div>
                Don't have an account, click <a
                    class="text-blue-500 underline"
                    role=""
                    target="_blank"
                    on:click={(_) => changeState("register")}
                    >here to register.</a
                >
            </div>
        </div>
        <div class={state === "register" ? "" : "hidden"}>
            <h2 class="text-lg font-bold pb-4">Registration</h2>
            <Label>Email</Label>
            <Input
                tabindex="3"
                bind:value={email}
                type="email"
                autocomplete="email"
            />
            <Label>Password</Label>
            <Input
                tabindex="4"
                type={showPassword ? "text" : "password"}
                autocomplete="new-password"
                bind:value={password}
            >
                <button
                    tabindex="-1"
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
            <Helper class={"mt-2 " + (error ? "" : "invisible")} color="red"
                ><span class="font-medium">{errorMessage}</span></Helper
            >
            <Button
                tabindex="5"
                class="my-4 w-full"
                on:click={register}
                disabled={logginIn}
                >Register {nextAction ? " & " + nextAction.display : ""}</Button
            >
        </div>
    </div>
</Modal>
