<template>
    <el-row :gutter="20">
        <el-col :span="18" :offset="2">
            <ul>
                <li v-for="a in items" :key="a.id" @click="goSelectSeat( a.id )">
                    <img :src="a.img" alt="">
                    <span>{{a.name}}</span>
                </li>
            </ul>
        </el-col>
    </el-row>
</template>

<script>
import { onBeforeMount, reactive } from '@vue/runtime-core'
import axios from "axios"
import { useRouter } from 'vue-router'


export default {
    name:"IndexCom",
    setup( ) {

        let items = reactive([ ])

        const router = useRouter( )

        onBeforeMount( ( ) =>{
            axios({
                url:"http://localhost:8088/api/getMovie",
                params:{
                    index:0
                }
            }).then( res =>{
                console.log(res.data);
                items.push( ...res.data.resu )
            } )
        })

        function goSelectSeat( id ) {
            router.push({
                name:"detail",
                params:{
                    id
                }
            })
        }

        return {
            goSelectSeat,
            items
        }
    }
}
</script>

<style lang="less" scoped>
ul{
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    li{
        display: flex;
        position: relative;
        margin: 20px;
        cursor: pointer;
        justify-content: center;
        span {
            position: absolute;
            bottom: -20px;
            font-size: 16px;
            font-weight: 700;
            text-align: center;
        }
        img{
            width: 200px;
            height: 250px;
        }
    }
}
</style>