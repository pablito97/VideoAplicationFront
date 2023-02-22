<template>
    <div class="container">
        <button type="button"
                class="btn btn-success m-2 fload-end"
                data-bs-toggle="modal"
                data-bs-target="#AddEditModal"
                @click="addClick()">
            Add Video
        </button>

        <button type="button"
                class="btn btn-warning m-2 fload-end"
                @click="addApiClick()">
            Download from other API
        </button>

        <table class="table table-striped table-sm">
            <thead>
                <tr>
                    <th scope="col">Video ID</th>
                    <th scope="col">Title</th>
                    <th scope="col">Director</th>
                    <th scope="col">Year</th>
                    <th scope="col">Rate</th>
                    <th scope="col">ApiId</th>
                    <th scope="col">Delete</th>
                    <th scope="col">Edit</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="v in videosList" :key="v.VideoId">
                    <td>{{v.VideoId}}</td>
                    <td>{{v.Title}}</td>
                    <td>{{v.Director}}</td>
                    <td>{{v.Year}}</td>
                    <td>{{v.Rate}}</td>
                    <td>{{v.ApiId}}</td>
                    <td>
                        <button type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#DeleteModal"
                                @click="deleteClick(v)">
                            Delete
                        </button>
                    </td>
                    <td>
                        <button type="button"
                                data-bs-toggle="modal"
                                data-bs-target="#AddEditModal"
                                @click="editClick(v)">
                            Edit
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div class="modal fade" id="AddEditModal" tabindex="-1" aria-labelledby="AddEditModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{{modalTitle}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="input-group mb-3 form-group">
                            <span class="input-group-text">Title</span>
                            <input type="text" class="form-control" v-model="state.Title" required>
                        </div>
                        <div class="alert alert-info" role="alert" v-if="v$.Title.$error">
                            {{v$.Title.$errors[0].$message}}
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">Director</span>
                            <input type="text" class="form-control" v-model="Director">
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text form__label">Year</span>
                            <input type="text" class="form-control" v-model="state.Year" min="1900" max="2200">
                        </div>
                        <div class="alert alert-info" role="alert" v-if="v$.Year.$error">
                            {{v$.Year.$errors[0].$message}}
                        </div>

                        <div class="input-group mb-3">
                            <span class="input-group-text">Rate</span>
                            <input type="number" class="form-control" v-model="Rate" min="1" max="20">
                        </div>
                        <div v-if="ApiId!=0" class="input-group mb-3">
                            <span class="input-group-text">ApiId</span>
                            <input type="text" class="form-control" v-model="ApiId">
                        </div>
                        <button type="button"
                                v-if="VideoId==0" class="btn btn-primary" @click="createClick()">
                            Create
                        </button>
                        <button type="button"
                                v-if="VideoId!=0" class="btn btn-primary" @click="updateClick()">
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="DeleteModal" tabindex="-1" role="dialog" aria-labelledby="DeleteModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{modalTitle}}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Are you sure, you want remove video with VideoId = {{VideoId}} and name "{{Title}}"</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" @click="removeClick()" data-bs-dismiss="modal">Yes, remove</button>
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" aria-label="Close">No, close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script lang="js">
import useValidate from '@vuelidate/core'
import { required, maxLength, between } from '@vuelidate/validators'
import {reactive, computed } from 'vue'
import axios from 'axios';

const API_URL = "/api/videos";

    export default {
        setup() {
            const state = reactive({
                VideoId: 0,
                Title: "",
                Director: "",
                Year: "",
                Rate: "",
                ApiId: 0,
            })

            const rules = computed(() => {
                return {
                    Title: { required, maxLength: maxLength(200) },
                    Year: { required, between: between(1900, 2200) },
                }
            })

            const v$ = useValidate(rules, state)
            return {
                state,
                v$,
            }
        },
        data() {
            return {
                videosList: null,
                modalTitle: "",
                VideoId: 0,
                Title: "",
                Director: "",
                Year: "",
                Rate: "",
                ApiId: 0,
            }
        },
        methods: {
            refreshData() {
                axios.get(API_URL)
                    .then((response) => {
                        this.videosList = response.data;
                    })
                    .catch(function (error) {
                        alert("Wait a second, server is running. Please refresh\n\n " + error);
                    });
            },
            addApiClick() {
                axios.get('/mymovies')
                    .then((response) => {

                        if (response.status == 500) {
                            alert("Wait a second, server is running");
                        }
                        var array = { 'Title': '', 'Director': '', 'Year': 0, 'Rate': 0, 'ApiId': 0 };


                        response.data.forEach(obj => {
                            Object.entries(obj).forEach(entry => {
                                const [key, value] = entry;

                                if (key == 'title') { array['Title'] = String(value); }
                                if (key == 'director') { array['Director'] = String(value); }
                                if (key == 'year') { array['Year'] = parseInt(value); }
                                if (key == 'rate') { array['Rate'] = parseInt(value); }
                                if (key == 'id') { array['ApiId'] = parseInt(value); }
                            });

                            axios.post(API_URL, {
                                Title: array['Title'],
                                Director: array['Director'],
                                Year: array['Year'],
                                Rate: array['Rate'],
                                ApiId: array['ApiId']
                            })
                                .then((response) => {
                                    if (response.status == 201) {
                                        console.log("Added");
                                    }
                                    this.refreshData();
                                })
                                .catch(function (error) {
                                    alert("Not added - apiId is in DB \n\n" + error);
                                    this.refreshData();
                                })
                        })
                    })
                    .catch(function (error) {
                        alert(error);
                    });
            },
            addClick() {
                this.modalTitle = "Add Video";
                this.VideoId = 0;
                this.state.Title = "";
                this.Director = "";
                this.state.Year = "";
                this.Rate = "";
                this.ApiId = 0;
            },
            editClick(v) {
                this.modalTitle = "Edit Video";
                this.VideoId = v.VideoId,
                this.state.Title = v.Title,
                this.Director = v.Director,
                this.state.Year = v.Year,
                this.Rate = v.Rate,
                this.ApiId = v.ApiId
            },
            deleteClick(v) {
                this.modalTitle = "Delete Video";
                this.VideoId = v.VideoId,
                    this.Title = v.Title
            },
            createClick() {
                this.v$.$validate()
                if (!this.v$.$error) {
                    axios.post(API_URL, {
                        Title: this.state.Title,
                        Director: this.Director,
                        Year: this.state.Year,
                        Rate: this.Rate,
                        ApiId: this.ApiId
                    })
                        .then((response) => {
                            console.log(response.data);
                            this.refreshData();
                        })
                        .catch(function (error) {
                            alert(error);
                        });
                }
            },
            updateClick() {
                this.v$.$validate()
                if (!this.v$.$error) {
                    axios.put(API_URL + "/" + this.VideoId, {
                        VideoId: this.VideoId,
                        Title: this.state.Title,
                        Director: this.Director,
                        Year: this.state.Year,
                        Rate: this.Rate,
                        ApiId: this.ApiId
                    })
                        .then((response) => {
                            console.log(response.data);
                            this.refreshData();
                        })
                        .catch(function (error) {
                            alert(error);
                        });
                }
            },
            removeClick() {
                axios.delete(API_URL + "/" + this.VideoId)
                    .then((response) => {
                        console.log(response.data);
                        this.refreshData();
                    })
                    .catch(function (error) {
                        alert(error);
                    });
            }
        },
        mounted: function () {
            this.refreshData();
        },
    };
</script>

<style scoped>

</style>
