<template>
    <v-btn @click="openDiscussion">Open Discussions</v-btn>
</template>

<script>
export default {
    // props: {
    //     freet: {
    //         type: Object,
    //         required: true,
    //     },
    // },
    methods: {
        openDiscussion() {
            console.log("discussion opened");
            // console.log("freet", this.freet);
        },
    },
};
</script>

<style></style>
