<template>
    <div v-loading="load">
        <el-row :gutter="20" class="row">
            <el-col :span="6" :offset="4" class="col">
                <img :src="items.content.img" alt="">
                <div class="msg">
                    <span>{{ items.content.name }}</span>
                    <i>{{ items.content.tag }}</i>  
                    <i>{{ items.content.time }}</i> 
                    <el-button type="danger" plain @click="goToSelect">前往购票</el-button>
                </div>
            </el-col>
            <el-col :span="24" class="intro">
                {{ items.content.introduce }}
            </el-col>
        </el-row>
    </div>
</template>

<script>
import { onBeforeMount, onMounted, reactive , ref } from '@vue/runtime-core'
import { useRoute, useRouter } from 'vue-router'
import axios from "axios"
import { loading } from '@/utils/popBox'
import { useStore } from 'vuex'

export default {
    name:"MovieDetail",
    setup( ) {

        let items = reactive({
            content:{ }
        }) 

        let load = ref(true)

        const router = useRouter( )

        const route = useRoute( )

        const store = useStore( )

        const id = route.params.id

        onBeforeMount( ( ) => {
            
            axios({
                url:"http://localhost:8088/api/getMovieDetail",
                params:{
                    id,
                }
            }).then( res =>{
                items.content = res.data.arr
                console.log( res.data.arr );
                load.value = false
            } )
        } )

        function goToSelect( ) {
            router.push({
                name:"payseat",
                params:{
                    agencyId: items.content.agencyId,
                    id
                }
            })
        }



        return {
            items,
            load,

            goToSelect
        }
    }
}
</script>

<style lang="less" scoped>
.row{
    // margin-top: 50px;
    padding: 50px;
    background-image: linear-gradient(to right bottom , #605b5b,#4a4b45, #1d2461);
}

.col{ 
    display: flex;

    img{ 
        width: 200px;
    }

    .msg{ 
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: 10px;
        span,i{ 
            display: inline-block;
            margin: 10px;
            vertical-align: top;
            color: white;
            font-size: 24px;
            font-weight: 700;
        }
        i{
            font-size: 16px;
            font-style: normal;
        }
    }
}

.intro{
    height: 300px;
    margin: 10px;
    padding: 30px;
    border-top: 2px solid white;
    color: white;
    font-size: 20px;
}

</style>