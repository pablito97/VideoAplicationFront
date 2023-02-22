<template>
    <div class="container">

        <button type="button"
                class="btn btn-warning m-2 fload-end"
                data-bs-toggle="modal"
                data-bs-target="#AddEditModal">
            Download from other API
        </button>

        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Director</th>
                    <th scope="col">Year</th>
                    <th scope="col">Rate</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="v in videosList" :key="v.Id">
                    <td>{{v.id}}</td>
                    <td>{{v.title}}</td>
                    <td>{{v.director}}</td>
                    <td>{{v.year}}</td>
                    <td>{{v.rate}}</td>
                </tr>
            </tbody>
        </table>

        <div class="modal fade" id="AddEditModal" tabindex="-1" role="dialog" aria-labelledby="AddEditModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Read API</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Read from outdor Api without save</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="readClick()" data-bs-dismiss="modal">Yes</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">No</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="js">
    import axios from 'axios';
    import { defineComponent } from 'vue';

const API_URL = "/mymovies";

export default defineComponent({
        data() {
            return {
                videosList: null,
            };
        },
        methods: {
            readClick() {
                axios.get(API_URL)
                    .then((response) => { 
                        this.videosList = response.data; 
                    });
            },
        },
});
</script>

<style scoped>

</style>
