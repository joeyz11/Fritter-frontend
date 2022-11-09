<template>
    <div>
        <FreetComponent
            :freet="
                $store.state.freets.find(
                    (freet) =>
                        freet.freet._id ===
                        this.$route.params.freetId.toString()
                )
            "
        />

        <DiscussionComponent
            :supportReplies="supportReplies"
            :neutralReplies="neutralReplies"
            :opposeReplies="opposeReplies"
        />
    </div>
</template>

<script>
import FreetComponent from "@/components/Freet/FreetComponent.vue";
import DiscussionComponent from "@/components/Discussion/DiscussionComponent.vue";

export default {
    data() {
        return {
            supportReplies: {
                type: Array,
                required: true,
            },
            neutralReplies: {
                type: Array,
                required: true,
            },
            opposeReplies: {
                type: Array,
                required: true,
            },
        };
    },
    components: { FreetComponent, DiscussionComponent },

    async beforeCreate() {
        const freetId = this.$route.params.freetId.toString();
        const r = await fetch(`/api/freets/${freetId}`);
        const res = await r.json();

        const supportR = await fetch(
            `/api/replies/${res.supportDiscussion._id}`
        );

        const neutralR = await fetch(
            `/api/replies/${res.neutralDiscussion._id}`
        );
        const opposeR = await fetch(`/api/replies/${res.opposeDiscussion._id}`);

        const supportRes = await supportR.json();
        const neutralRes = await neutralR.json();
        const opposeRes = await opposeR.json();

        this.supportReplies = supportRes;
        this.neutralReplies = neutralRes;
        this.opposeReplies = opposeRes;

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
