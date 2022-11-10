<script>
import BlockForm from "@/components/common/BlockForm.vue";

export default {
    name: "CreateReplyForm",
    mixins: [BlockForm],
    data() {
        return {
            url: `/api/replies/${this.$store.state.currFreet.freet._id}`,
            method: "POST",
            hasBody: true,
            fields: [{ id: "content", label: "Content", value: "" }],
            title: "Create a reply",
            refreshDiscussions: true,
            callback: () => {
                const message = "Successfully created a reply!";
                this.$set(this.alerts, message, "success");
                setTimeout(() => this.$delete(this.alerts, message), 3000);
            },
        };
    },
};
</script>
