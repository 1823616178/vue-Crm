<template>
    <dragTreeTable :data="treeData" :onDrag="onTreeDataChange" :isdraggable="true"></dragTreeTable>
</template>
<script>
    import dragTreeTable from 'drag-tree-table'

    export default {
        components: {dragTreeTable},
        data() {
            return {
                treeData: {
                    lists: [],
                    custom_field: {
                        id: 'id',
                        order: 'sort',
                        lists: 'children',
                        parent_id: 'parent_id'
                    },
                    columns: []
                }
            }
        },
        methods: {
            onTreeDataChange(list) {
                this.treeData.lists = list
                // custom_field.list === 'children'
                // 自定义lists相应的回传数据也用相同字段
                // this.treeData.children = list
            },
        }
    }
</script>