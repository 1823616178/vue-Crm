<template>
    <vueDragInfinite :json="abc"
                     :name="name"
                     @save="saveJson"/>
</template>

<script>
    import vueDragInfinite from 'vue-drag-infinite/src/lib/vue-drag-infinite.vue'
    import indexVue from '../login/index.vue';
    import {constants} from 'fs';

    export default {
        components: {vueDragInfinite},
        data: function () {
            return {
                name: '动态排版',
                abc: [
                    {
                        style: {
                            width: "200px",
                        },
                        text: '这是第一个'
                    },
                    {
                        style: {
                            width: '300px',
                        },
                        text: '这是第二个'
                    },
                ],
                add: []
            }
        },
        created() {
        },
        methods: {
            saveJson: function (data) {
                window.console.log(data)
            }
        }
    }
</script>

<style>
    .EnumDataShow {
        position: relative;
        background: #0a76a4;
        height: 100%;
    }
</style>
