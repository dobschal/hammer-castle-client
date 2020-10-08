<template>
    <div class="forum">
        <div v-if="!activeCategory">
            <p>This is the amazing forum to discuss new features and change requests. Aaaand of course to report bugs...</p>
            <img src="../assets/banner.gif" alt="Banner" class="banner">
        </div>
        <div class="categories" v-if="!activeCategory">
            <div class="header">
                <button v-if="isAdmin" @click="openAddCategory">Add Category</button>
                <h2>Categories</h2>
                <p>Select a category...</p>
            </div>
            <div class="category-list">
                <div class="category" v-for="category in categories" :key="category.id" @click="openCategory(category)">
                    <button v-if="isAdmin" @click="openEditCategory(category)">edit</button>
                    <h3>❆ {{ category.name }}</h3>
                    <p>{{ category.description }}</p>
                </div>
            </div>
            <div v-if="isAdmin && (addCategory || editCategory)">
                <button @click="closeCategoryEditor">Close</button>
                <form @submit.prevent="saveCategory">
                    <h3>{{ editCategory ? 'Save Category' : 'Add Category' }}</h3>
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
        <div class="category" v-else-if="activeCategory">
            <button @click="closeCategory" class="negative">Back</button>
            <h2>{{ activeCategory.name }}</h2>
            <p>{{ activeCategory.description }}</p>
            <div class="entries">
                <div class="empty" v-if="entries.length === 0">No entries found.</div>
                <div class="entry" v-for="entry in entries" :key="entry.id">
                    <h4>{{ entry.username }} wrote
                        <DateView :timestamp="entry.timestamp"></DateView>
                        :
                    </h4>
                    <pre>{{ entry.content }}</pre>
                </div>
            </div>
            <div>
                <form @submit.prevent="addEntry">
                    <div>
                        <label for="entry-content">Add new entry to {{ activeCategory.name }}.</label>
                        <textarea name="entry-content" id="entry-content" cols="30" rows="10"
                                  v-model="entryContent"></textarea>
                    </div>
                    <button type="submit">Save Entry</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>

    import DateView from "./DateView";

    export default {
        name: "Forum",
        components: {DateView},
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
            },
            editCategory() {
                return Boolean(this.categoryId);
            },
            entries() {
                const entries = this.$store.state.forumEntries;
                return entries;
            }
        },
        watch: {
            "activeCategory.id"(categoryId) {
                if (categoryId)
                    this.$store.dispatch("GET_FORUM_ENTRIES", categoryId);
            }
        },
        data() {
            return {
                categoryName: "",
                categoryDescription: "",
                categoryId: undefined,
                addCategory: false,
                activeCategory: undefined,
                entryContent: ""
            };
        },
        created() {
            this.$store.dispatch("GET_FORUM_CATEGORIES");
        },
        methods: {
            async saveCategory() {
                const payload = {
                    name: this.categoryName,
                    description: this.categoryDescription
                };
                if (this.categoryId) {
                    payload.id = this.categoryId;
                }
                await this.$store.dispatch("CREATE_FORUM_CATEGORY", payload);
                await this.$store.dispatch("GET_FORUM_CATEGORIES");
                this.closeCategoryEditor();
            },
            openEditCategory(category) {
                this.addCategory = false;
                this.categoryName = category.name;
                this.categoryDescription = category.description;
                this.categoryId = category.id;
            },
            openAddCategory() {
                this.categoryName = "";
                this.categoryDescription = "";
                this.categoryId = undefined;
                this.addCategory = true;
            },
            closeCategoryEditor() {
                this.categoryName = "";
                this.categoryDescription = "";
                this.categoryId = undefined;
                this.addCategory = false;
            },
            openCategory(category) {
                this.activeCategory = category;
            },
            closeCategory() {
                this.activeCategory = undefined;
            },
            async addEntry() {
                console.log("[Forum] Add entry: ", this.activeCategory.id);
                await this.$store.dispatch("CREATE_FORUM_ENTRY", {
                    content: this.entryContent,
                    categoryId: this.activeCategory.id
                });
                await this.$store.dispatch("GET_FORUM_ENTRIES", this.activeCategory.id);
            }
        }
    }
</script>

<style lang="scss" scoped>

    .banner {
        display: block;
        margin: 0 auto;
        width: 66%;
        border-radius: 1rem;
        overflow: hidden;
        box-shadow: 0 5px 5px -5px black;
    }

    form label {
        display: block;
        font-weight: bold;
        margin-bottom: 0.5rem;
    }

    form input, form textarea {
        display: block;
        width: 100%;
        box-sizing: border-box;
    }

    .entries {
        margin-bottom: 2rem;
        .entry {
            h4 {
                font-family: 'Piazzolla', serif;
                margin: 0;
            }

            pre {
                font-family: 'Piazzolla', serif;
                margin: 0;
            }
        }
    }

    button {
        padding: 0.25rem 0.5rem;
    }

    .header {
        button {
            float: right;
        }
    }

    .category {
        button {
            float: right;
        }
    }

    .category-list {
        .category {
            button {
                float: right;
            }

            transition: padding-left 0.3s ease-out;

            &:hover {
                cursor: pointer;
                padding-left: 1rem;
            }
        }
    }

    textarea {
        border: solid 1px #EFEFEF;
        border-radius: 8px;
        background-color: rgba(255, 255, 255, 0.8);
        margin-bottom: 1rem;
        font-family: 'Piazzolla', serif;
        font-size: 1rem;
        padding: 0.5rem;
    }
</style>
