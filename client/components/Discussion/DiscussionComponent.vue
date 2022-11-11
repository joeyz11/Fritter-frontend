<template>
    <div>
        <CreateReplyForm :discussionId="$store.state.currDiscussionId" />
        <b-tabs fill content-class="mt-3">
            <b-tab
                title="Support"
                active
                @click="setCurrDiscussionId('supportDiscussion')"
            >
                <div v-if="supportReplies && supportReplies.length">
                    <div :key="sRep._id" v-for="sRep in supportReplies">
                        <ReplyComponent :reply="sRep" />
                    </div>
                </div>
                <div v-else>No comments here:(</div>
            </b-tab>
            <b-tab
                title="Neutral"
                @click="setCurrDiscussionId('neutralDiscussion')"
            >
                <div v-if="neutralReplies.length">
                    <div :key="nRep._id" v-for="nRep in neutralReplies">
                        <ReplyComponent :reply="nRep" />
                    </div>
                </div>
                <div v-else>No comments here:(</div>
            </b-tab>
            <b-tab
                title="Oppose"
                @click="setCurrDiscussionId('opposeDiscussion')"
            >
                <div v-if="opposeReplies.length">
                    <div :key="oRep._id" v-for="oRep in opposeReplies">
                        <ReplyComponent :reply="oRep" />
                    </div>
                </div>
                <div v-else>No comments here:(</div>
            </b-tab>
        </b-tabs>
    </div>
</template>

<script>
import ReplyComponent from "@/components/Reply/ReplyComponent.vue";
import CreateReplyForm from "@/components/Reply/CreateReplyForm.vue";

export default {
    name: "DiscussionComponent",
    components: { ReplyComponent, CreateReplyForm },
    props: {
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
    },
    data() {
        return {
            sentiment: "supportDiscussion",
        };
    },
    methods: {
        setCurrDiscussionId(sentiment) {
            console.log("sent", sentiment);
            this.$store.commit("updateCurrDiscussionId", sentiment);
        },
    },
    created() {
        this.$store.commit("updateCurrDiscussionId", "supportDiscussion");
    },
};
</script>

<style></style>
