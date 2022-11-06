<template>
    <div>
        <div>Discussion Page Here</div>
        <div>{{ $route.params.freetId }}</div>
        <!-- <FreetComponent :freet="freet" /> -->
    </div>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";

export default {
    // props: {
    //     freet: {
    //         type: Object,
    //         required: true,
    //     },
    // },
    components: { FreetComponent },

    async created() {
        try {
            const r = await fetch(
                `/api/freets/${$route.params.freetId}`
                // options
            );
            console.log();
            if (!r.ok) {
                const res = await r.json();
                throw new Error(res.error);
            }

            this.editing = false;
            this.$store.commit("refreshFreets");

            params.callback();
        } catch (e) {
            this.$set(this.alerts, e, "error");
            setTimeout(() => this.$delete(this.alerts, e), 3000);
        }
    },
};
</script>

<style></style>
