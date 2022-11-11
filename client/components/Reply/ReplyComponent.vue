<template>
    <article class="reply">
        <div>
            <!-- <v-btn @click="incUpvote">upvote</v-btn> -->
            <!-- <div>{{ netUpvote }}</div> -->
            <!-- <v-btn @click="decUpvote">downvote</v-btn> -->
        </div>
        <header>
            <h3 class="author">@{{ reply.reply.author }}</h3>
            <div
                v-if="$store.state.username === reply.reply.author"
                class="actions"
            >
                <v-btn v-if="editing" @click="submitEdit">
                    ✅ Save changes
                </v-btn>
                <v-btn v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </v-btn>
                <v-btn v-if="!editing" @click="startEditing">✏️ Edit</v-btn>
                <v-btn @click="deleteReply">🗑️ Delete</v-btn>
            </div>
        </header>
        <div v-if="editing">
            <textarea
                style="border: solid 1px"
                class="content"
                :value="draft"
                @input="draft = $event.target.value"
            />
        </div>

        <div v-else class="content">
            <p>{{ reply.reply.content }}</p>
        </div>
        <p class="info">
            Posted at {{ reply.reply.dateModified }}
            <i v-if="reply.reply.edited">(edited)</i>
        </p>

        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </article>
</template>

<script>
export default {
    name: "ReplyComponent",
    props: {
        reply: {
            type: Object,
            required: true,
        },
    },
    data() {
        return {
            editing: false, // Whether or not this reply is in edit mode
            draft: this.reply.reply.content, // Potentially-new content for this reply
            alerts: {}, // Displays success/error messages encountered during reply modification
            netUpvote: null,
        };
    },
    methods: {
        async getNetUpvote() {
            const res = await fetch(
                `/api/upvotes/${this.reply.reply._id}`
            ).then(async (r) => r.json());
            this.netUpvote = res.upvote.numUpvote;
        },
        async incUpvote() {
            try {
                const options = {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin", // Sends express-session credentials with request
                };
                const res = await fetch(
                    `/api/upvotes/${this.reply.reply._id}/inc`,
                    options
                ).then(async (r) => r.json());
                console.log(res);
                this.netUpvote = res.upvote.numUpvote;
                this.$store.commit(
                    "refreshDiscussions",
                    this.$store.state.currFreet.freet._id
                );
                // this.getNetUpvote();
            } catch (e) {
                const message = "Cannot vote again!";
                this.$set(this.alerts, message, "error");
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            }
        },
        async decUpvote() {
            try {
                const options = {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    credentials: "same-origin", // Sends express-session credentials with request
                };
                const res = await fetch(
                    `/api/upvotes/${this.reply.reply._id}/dec`,
                    options
                ).then(async (r) => r.json());
                console.log(res);
                this.netUpvote = res.upvote.numUpvote;
                this.$store.commit(
                    "refreshDiscussions",
                    this.$store.state.currFreet.freet._id
                );
                // this.getNetUpvote();
            } catch (e) {
                const message = "Cannot vote again!";
                this.$set(this.alerts, message, "error");
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            }
        },
        startEditing() {
            /**
             * Enables edit mode on this reply.
             */
            this.editing = true; // Keeps track of if a reply is being edited
            this.draft = this.reply.reply.content; // The content of our current "draft" while being edited
        },
        stopEditing() {
            /**
             * Disables edit mode on this reply.
             */
            this.editing = false;
            this.draft = this.reply.reply.content;
        },
        deleteReply() {
            /**
             * Deletes this reply.
             */
            const params = {
                method: "DELETE",
                callback: () => {
                    this.$store.commit("alert", {
                        message: "Successfully deleted reply!",
                        status: "success",
                    });
                },
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates reply to have the submitted draft content.
             */
            if (this.reply.reply.content === this.draft) {
                const error =
                    "Error: Edited reply content should be different than current reply content.";
                this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: "PATCH",
                message: "Successfully edited reply!",
                body: JSON.stringify({
                    content: this.draft,
                }),
                callback: () => {
                    this.$set(this.alerts, params.message, "success");
                    setTimeout(
                        () => this.$delete(this.alerts, params.message),
                        3000
                    );
                },
            };
            this.request(params);
        },
        async request(params) {
            /**
             * Submits a request to the reply's endpoint
             * @param params - Options for the request
             * @param params.body - Body for the request, if it exists
             * @param params.callback - Function to run if the the request succeeds
             */
            const options = {
                method: params.method,
                headers: { "Content-Type": "application/json" },
            };
            if (params.body) {
                options.body = params.body;
            }

            try {
                const r = await fetch(
                    `/api/replies/${this.reply.reply._id}`,
                    options
                );

                if (!r.ok) {
                    const res = await r.json();
                    console.log("res error", res);
                    throw new Error(res.error);
                }
                this.editing = false;
                this.$store.dispatch("refreshDiscussionsAction", {
                    freetId: this.$store.state.currFreet.freet._id,
                });

                params.callback();
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    },
    async created() {
        this.getNetUpvote();
    },
};
</script>

<style scoped>
.reply {
    border: 1px solid #111;
    padding: 20px;
    margin: 20px;
    position: relative;
}
</style>
