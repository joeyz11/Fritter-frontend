<!-- Reusable component representing a form in a block style -->
<!-- This is just an example; feel free to define any reusable components you want! -->

<template>
    <form @submit.prevent="submit">
        <h3>{{ title }}</h3>
        <article v-if="fields.length">
            <div v-for="field in fields" :key="field.id">
                <label :for="field.id">{{ field.label }}:</label>
                <textarea
                    v-if="field.id === 'content'"
                    style="border: solid 1px"
                    :name="field.id"
                    :value="field.value"
                    @input="field.value = $event.target.value"
                />
                <div
                    v-else-if="field.id === 'satire'"
                    style="display: flex; flex-direction: column"
                >
                    <label>
                        <input
                            id="true"
                            type="radio"
                            style="vertical-align: middle; margin: 0px"
                            name="satire"
                            value="true"
                            @change="field.value = $event.target.value"
                        />
                        True
                    </label>
                    <label>
                        <input
                            id="false"
                            type="radio"
                            name="satire"
                            value="false"
                            @change="field.value = $event.target.value"
                        />
                        False
                    </label>
                </div>
                <input
                    v-else
                    style="border: solid 1px"
                    :type="field.id === 'password' ? 'password' : 'text'"
                    :name="field.id"
                    :value="field.value"
                    @input="field.value = $event.target.value"
                />
            </div>
        </article>
        <article v-else>
            <p>{{ content }}</p>
        </article>
        <v-btn type="submit">
            {{ title }}
        </v-btn>
        <section class="alerts">
            <article
                v-for="(status, alert, index) in alerts"
                :key="index"
                :class="status"
            >
                <p>{{ alert }}</p>
            </article>
        </section>
    </form>
</template>

<script>
export default {
    name: "BlockForm",
    data() {
        /**
         * Options for submitting this form.
         */
        return {
            url: "", // Url to submit form to
            method: "GET", // Form request method
            hasBody: false, // Whether or not form request has a body
            setUsername: false, // Whether or not stored username should be updated after form submission
            refreshFreets: false, // Whether or not stored freets should be updated after form submission
            alerts: {}, // Displays success/error messages encountered during form submission
            callback: null, // Function to run after successful form submission
        };
    },
    methods: {
        clearInputs() {
            console.log("clearing inputs");
            this.fields.map((field) => {
                // const { id, value } = field;
                if (field.id === "content") {
                    field.value = "";
                } else if (field.id === "satire") {
                    field.value = undefined;
                }
                // return [id, value];
            });
        },
        async submit() {
            /**
             * Submits a form with the specified options from data().
             */
            const options = {
                method: this.method,
                headers: { "Content-Type": "application/json" },
                credentials: "same-origin", // Sends express-session credentials with request
            };
            if (this.hasBody) {
                options.body = JSON.stringify(
                    Object.fromEntries(
                        this.fields.map((field) => {
                            const { id, value } = field;
                            return [id, value];
                        })
                    )
                );
                console.log("options body", options.body);
            }

            try {
                const r = await fetch(this.url, options);
                if (r.ok) {
                    this.clearInputs();
                }
                console.log("r", r);
                if (!r.ok) {
                    // If response is not okay, we throw an error and enter the catch block
                    const res = await r.json();
                    throw new Error(res.error);
                }

                if (this.setUsername) {
                    const text = await r.text();
                    const res = text ? JSON.parse(text) : { user: null };
                    this.$store.commit(
                        "setUsername",
                        res.user ? res.user.username : null
                    );
                }

                if (this.refreshFreets) {
                    this.$store.commit("refreshFreets");
                }

                if (this.refreshDiscussions) {
                    this.$store.commit(
                        "refreshDiscussions",
                        this.$store.state.currFreet.freet._id
                    );
                }

                if (this.callback) {
                    this.callback();
                }
            } catch (e) {
                this.$set(this.alerts, e, "error");
                setTimeout(() => this.$delete(this.alerts, e), 3000);
            }
        },
    },
};
</script>

<style scoped>
form {
    border: 1px solid #111;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    margin-bottom: 14px;
    position: relative;
}

article > div {
    display: flex;
    flex-direction: column;
}

form > article p {
    margin: 0;
}

form h3,
form > * {
    margin: 0.3em 0;
}

form h3 {
    margin-top: 0;
}

textarea {
    border: 2px;
}
</style>
