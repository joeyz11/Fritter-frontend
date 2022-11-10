<!-- Reusable component representing a single freet and its actions -->
<!-- We've tagged some elements with classes; consider writing CSS using those classes to style them... -->

<template>
    <article class="freet">
        <header>
            <h3 class="author">@{{ freet.freet.author }}</h3>
            <p class="info">
                Posted at {{ freet.freet.dateModified }}
                <i v-if="freet.freet.edited">(edited)</i>
            </p>
            <div
                v-if="$store.state.username === freet.freet.author && allButton"
                class="actions"
            >
                <v-btn v-if="!editing" @click="startEditing">✏️ Edit</v-btn>
                <v-btn v-if="editing" @click="stopEditing">
                    🚫 Discard changes
                </v-btn>
                <v-btn @click="deleteFreet">🗑️ Delete</v-btn>
            </div>
        </header>
        <div v-if="editing">
            <textarea
                style="border: solid 1px; width: 100%; max-width: 100%"
                :value="draft"
                @input="draft = $event.target.value"
            />
            <div style="display: flex; flex-direction: column">
                <label>
                    <input
                        id="true"
                        type="radio"
                        name="satire"
                        value="true"
                        @change="editStamp = $event.target.value"
                    />
                    True
                </label>
                <label>
                    <input
                        id="false"
                        type="radio"
                        name="satire"
                        value="false"
                        @change="editStamp = $event.target.value"
                    />
                    False
                </label>
            </div>
        </div>

        <div v-else>
            <p class="content">{{ freet.freet.content }}</p>
            <v-btn plain class="satire" :ripple="false">
                <span @click="showSatire = true">#</span>
                <span v-if="showSatire"
                    >{{ freet.stampOfHumor.isSatire ? "satire" : "notSatire" }}
                </span>
                <span v-else @click="showSatire = true">???</span>
            </v-btn>
        </div>

        <div
            v-if="$store.state.username === freet.freet.author"
            class="actions"
        >
            <v-btn v-if="editing" @click="submitEdit"> ✅ Save changes </v-btn>
        </div>

        <router-link
            :to="{ name: 'Discussion', params: { freetId: freet.freet._id } }"
            style="text-decoration: none"
            v-show="allButton"
        >
            <div v-show="!editing">
                <DiscussionButton />
            </div>
        </router-link>

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
import DiscussionButton from "@/components/Discussion/DiscussionButton.vue";
export default {
    name: "FreetComponent",
    components: { DiscussionButton },
    props: {
        // Data from the stored freet
        freet: {
            type: Object,
            required: false,
        },
        allButton: {
            type: Boolean,
            default: true,
        },
        showSatire: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            editing: false, // Whether or not this freet is in edit mode
            draft: this.freet.freet.content, // Potentially-new content for this freet
            editStamp: this.freet.stampOfHumor.isSatire,
            alerts: {}, // Displays success/error messages encountered during freet modification
        };
    },
    methods: {
        startEditing() {
            /**
             * Enables edit mode on this freet.
             */
            this.editing = true; // Keeps track of if a freet is being edited
            this.draft = this.freet.freet.content; // The content of our current "draft" while being edited
            this.editStamp = this.freet.stampOfHumor.isSatire;
        },
        stopEditing() {
            /**
             * Disables edit mode on this freet.
             */
            this.editing = false;
            this.draft = this.freet.freet.content;
            this.editStamp = this.freet.stampOfHumor.isSatire;
        },
        deleteFreet() {
            /**
             * Deletes this freet.
             */
            const params = {
                method: "DELETE",
                callback: () => {
                    this.$store.commit("alert", {
                        message: "Successfully deleted freet!",
                        status: "success",
                    });
                },
            };
            this.request(params);
        },
        submitEdit() {
            /**
             * Updates freet to have the submitted draft content.
             */
            if (this.freet.freet.content === this.draft) {
                const error =
                    "Error: Edited freet content should be different than current freet content.";
                this.$set(this.alerts, error, "error"); // Set an alert to be the error text, timeout of 3000 ms
                setTimeout(() => this.$delete(this.alerts, error), 3000);
                return;
            }

            const params = {
                method: "PATCH",
                message: "Successfully edited freet!",
                body: JSON.stringify({
                    content: this.draft,
                    satire: this.editStamp,
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
             * Submits a request to the freet's endpoint
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
                    `/api/freets/${this.freet.freet._id}`,
                    options
                );

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
    },
};
</script>

<style scoped>
.freet {
    border: 1px solid #111;
    padding: 20px;
    margin: 20px 0;

    position: relative;
}

.author {
    font-weight: bold;
}
.info {
    font-size: 12px;
}

.content {
    font-size: 28px;
}
.satire {
    margin: 20px -12px;
    cursor: pointer;
}
</style>
