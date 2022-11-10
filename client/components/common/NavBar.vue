<!-- A basic navigation bar component -->
<!-- Example of a component which is included on all pages (via App.vue) -->
<!-- This navbar takes advantage of both flex and grid layouts for positioning elements; feel free to redesign as you see fit! -->

<template>
    <nav>
        <div class="left">
            <router-link to="/" class="home" style="text-decoration: none">
                <img src="../../public/logo.svg" class="logo" />
            </router-link>
        </div>
        <div class="right">
            <router-link to="/" class="home" style="text-decoration: none">
                <v-btn text style="color: #fff; font-size: 20px"> Home </v-btn>
            </router-link>
            <router-link
                v-if="$store.state.username"
                to="/account"
                style="text-decoration: none"
            >
                <v-btn text style="color: #fff; font-size: 20px">
                    Account
                </v-btn>
            </router-link>
            <router-link v-else to="/login" style="text-decoration: none">
                <v-btn text style="color: #fff; font-size: 20px"> Login </v-btn>
            </router-link>
        </div>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in $store.state.alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </nav>
</template>

<script>
export default {};
</script>

<style scoped>
nav {
    padding: 1vw 16vw;
    margin-bottom: 40px;
    background-color: #1da1f2;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

.title {
    font-size: 32px;
    margin: 0 5px;
    color: #fff;
}

.logo {
    height: 44px;
}

.left {
    display: flex;
    align-items: center;
}

.right {
    font-size: 20px;
    display: grid;
    gap: 16px;
    grid-auto-flow: column;
    align-items: center;
}

.right a {
    margin-left: 5px;
}
.alerts {
    width: 25%;
}
</style>
