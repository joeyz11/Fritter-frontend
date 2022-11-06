<template>
    <div>
        <div>Discussion Page Here</div>
        <div>{{ freet }}</div>
        <div>{{ stampOfHumor }}</div>
        <div>{{ supportDiscussion }}</div>
        <div>{{ neutralDiscussion }}</div>
        <div>{{ opposeDiscussion }}</div>
        <!-- <FreetComponent :key="freet._id" :freet="freet" /> -->
    </div>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import { onBeforeMount } from "vue";

export default {
    data() {
        return {
            freet: {
                type: Object,
                required: true,
            },
            stampOfHumor: {
                type: Object,
                required: true,
            },
            supportDiscussion: {
                type: Object,
                required: true,
            },
            neutralDiscussion: {
                type: Object,
                required: true,
            },
            opposeDiscussion: {
                type: Object,
                required: true,
            },
        };
    },
    components: { FreetComponent },

    async created() {
        const r = await fetch(`/api/freets/${this.$route.params.freetId}`);
        const res = await r.json();
        console.log(res);
        this.freet = res.freet;
        this.stampOfHumor = res.stampOfHumor;
        this.supportDiscussion = res.supportDiscussion;
        this.neutralDiscussion = res.neutralDiscussion;
        this.opposeDiscussion = res.opposeDiscussion;

        // try {
        //     const r = await fetch(
        //         `/api/freets/${$route.params.freetId}`
        //         // options
        //     );
        //     console.log(r);
        //     if (!r.ok) {
        //         const res = await r.json();
        //         throw new Error(res.error);
        //     }
        //     this.editing = false;
        //     this.$store.commit("refreshFreets");
        //     params.callback();
        // } catch (e) {
        //     this.$set(this.alerts, e, "error");
        //     setTimeout(() => this.$delete(this.alerts, e), 3000);
        // }
    },
};
</script>

<style></style>
