<template>
    <v-btn v-if="$store.state.diversified" @click="toggleDiversify">
        Diversify Off
    </v-btn>
    <v-btn v-else @click="toggleDiversify">Diversify On</v-btn>
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
