<template>
    <main class="discussionPage">
        <FreetComponent
            :freet="$store.state.currFreet"
            :allButton="false"
            :showSatire="true"
        />
        <!-- <CreateReplyForm /> -->
        <DiscussionComponent
            :supportReplies="$store.state.supportDiscussions"
            :neutralReplies="$store.state.neutralDiscussions"
            :opposeReplies="$store.state.opposeDiscussions"
        />
    </main>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import DiscussionComponent from "@/components/Discussion/DiscussionComponent.vue";
import CreateReplyForm from "@/components/Reply/CreateReplyForm.vue";

export default {
    data() {
        return {};
    },
    components: { FreetComponent, DiscussionComponent, CreateReplyForm },

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

<style scoped>
.discussionPage {
    margin: 0 20%;
}
</style>
