<template>
    <div>
        <b-tabs content-class="mt-3">
            <b-tab title="Support" active>
                <div v-if="supportReplies.length">
                    <div :key="sRep._id" v-for="sRep in supportReplies">
                        <ReplyComponent :reply="sRep" />
                    </div>
                </div>
                <div v-else>No comments here:(</div>
            </b-tab>
            <b-tab title="Neutral">
                <div v-if="neutralReplies.length">
                    <div :key="nRep._id" v-for="nRep in neutralReplies">
                        <ReplyComponent :reply="nRep" />
                    </div>
                </div>
                <div v-else>No comments here:(</div>
            </b-tab>
            <b-tab title="Oppose">
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

export default {
    name: "DiscussionComponent",
    components: { ReplyComponent },
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
        return {};
    },
};
</script>

<style></style>
