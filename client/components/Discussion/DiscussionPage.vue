<template>
    <div>
        <FreetComponent :freet="$store.state.currFreet" />
        <DiscussionComponent
            :supportReplies="$store.state.supportDiscussions"
            :neutralReplies="$store.state.neutralDiscussions"
            :opposeReplies="$store.state.opposeDiscussions"
        />
    </div>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import DiscussionComponent from "@/components/Discussion/DiscussionComponent.vue";

export default {
    data() {
        return {};
    },
    components: { FreetComponent, DiscussionComponent },

    async created() {
        const freetId = this.$route.params.freetId.toString();
        this.$store.dispatch("refreshDiscussionsAction", { freetId: freetId });

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
