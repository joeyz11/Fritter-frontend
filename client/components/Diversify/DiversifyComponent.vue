<template>
    <button v-if="$store.state.diversified" @click="toggleDiversify">
        Diversify Off
    </button>
    <button v-else @click="toggleDiversify">Diversify On</button>
</template>

<script>
export default {
    methods: {
        toggleDiversify() {
            this.$store.dispatch("toggleDiversify");
        },
    },
};
</script>

<style></style>
