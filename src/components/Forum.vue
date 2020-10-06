<template>
    <div>
        <p>This will be the amazing to discuss new features and change requests. Aaaand of course to report bugs :) </p>
        <div>
            <p v-for="category in categories" :key="category.id">{{ category.name }}</p>
        </div>
        <div v-if="isAdmin">
            <form @submit.prevent="saveCategory">
                <h3>Add Category</h3>
                <div>
                    <label for="category-name">Name</label>
                    <input id="category-name" type="text" v-model="categoryName">
                </div>
                <div>
                    <label for="category-description">Description</label>
                    <textarea name="category-description" id="category-description" cols="30" rows="10"
                              v-model="categoryDescription"></textarea>
                </div>
                <button type="submit">Save Category</button>
            </form>
        </div>
    </div>
</template>

<script>

    export default {
        name: "Forum",
        computed: {
            user() {
                return this.$store.state.user;
            },
            userRoles() {
                return JSON.parse(atob(this.$store.state.authToken.split(".")[0])).userRoles.split(",");
            },
            isAdmin() {
                return this.userRoles.includes("ADMIN");
            },
            categories() {
                return this.$store.state.forumCategories;
            }
        },
        data() {
            return {
                categoryName: "",
                categoryDescription: ""
            };
        },
        created() {
            this.$store.dispatch("GET_FORUM_CATEGORIES");
        },
        methods: {
            async saveCategory() {
                await this.$store.dispatch("CREATE_FORUM_CATEGORY", {
                    name: this.categoryName,
                    description: this.categoryDescription
                });
                await this.$store.dispatch("GET_FORUM_CATEGORIES");
            }
        }
    }
</script>

<style lang="scss" scoped>
    form label {
        display: block;
        font-weight: bold;
    }

    form input, form textarea {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }
</style>
