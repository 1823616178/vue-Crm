-
<template>
    <div class="dashboard-editor-container">
        <el-row type="flex"
                justify="center">
            <el-col>
                <div class=" clearfix">
                    <pan-thumb :image="avatar"
                               style="float: left">
                        您好
                        <span class="pan-info-roles">{{ introduction }}</span>
                    </pan-thumb>
                    <!-- <github-corner style="position: absolute; top: 0px; border: 0; right: 0;" /> -->
                    <div class="info-container">
                        <span class="display_name">你好 &nbsp {{ introduction }}</span>
                        <span style="font-size:20px;padding-top:20px;display:inline-block;">新的一天，新的心情</span>
                    </div>
                </div>
            </el-col>
            <el-col :span="5">
                <vueClock :border="clock.border"
                          :number="clock.number"
                          :dial="clock.dial"/>
            </el-col>
        </el-row>
        <el-row type="centre"
                align="mddle">
            <el-col>
                <div>
                    <img :src="emptyGif"
                         class="emptyGif">
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import PanThumb from '@/components/PanThumb'
    import GithubCorner from '@/components/GithubCorner'
    import {vueClock} from 'vue-clock-lonlyape'

    export default {
        name: 'DashboardEditor',
        components: {PanThumb, GithubCorner, vueClock},
        data() {
            return {
                clock: {
                    number: {
                        type: "roman",
                        color: '#FF00FF'
                    },
                    border: {
                        type: 'circle',
                        color: '#32CD32'
                    },
                    dial: {
                        color: "#483D8B"
                    }
                },
                emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
            }
        },
        computed: {
            ...mapGetters([
                'name',
                'avatar',
                'roles',
                'introduction'
            ])
        }
    }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
    .emptyGif {
        display: block;
        width: 45%;
        margin: 0 auto;
    }

    .dashboard-editor-container {
        background-color: #e3e3e3;
        min-height: 100vh;
        width: 100%;
        padding: 50px 60px 0px;

        .pan-info-roles {
            font-size: 12px;
            font-weight: 700;
            color: #333;
            display: block;
        }

        .info-container {
            position: relative;
            margin-left: 190px;
            height: 150px;
            line-height: 200px;

            .display_name {
                font-size: 48px;
                line-height: 48px;
                color: #212121;
                position: absolute;
                top: 25px;
            }
        }
    }
</style>
