<template>
    <div v-loading="load">
        <h1>{{ items.content.name }} </h1>
        <img :src="items.content.img" alt="">
        <h3>{{ items.content.time }}</h3>
        <h3>{{ items.content.tag }}</h3>
        <h5>{{ items.content.introduce }}</h5>
        <h1>
            当前订票信息
        </h1>
        <div class="ticket">
            <ul>
                <li v-for="a in array" :key="a.name">
                    {{ a.name }}
                </li>
            </ul>
        </div>
        <span v-if="array.length">总价：{{ array.length * items.content.price }} 元</span>
        <el-button type="danger" plain @click="Pay">确认购票</el-button>
    </div>
</template>

<script>
import { onBeforeMount, reactive, ref } from '@vue/runtime-core'
import { useRoute } from 'vue-router'
import axios from "axios"
import { warning , loading , confirmBox} from '@/utils/popBox'


export default {
    name:"SelectMovieReport",
    props:["array"],
    setup( props,context ) {
        let items = reactive( {
            content:{ }
        } )

        let load = ref( true )

        const route = useRoute( )

        onBeforeMount( ( ) =>{
            axios({
                url:"http://localhost:8088/api/getMovieDetail",
                params:{
                    id: route.params.id
                }
            }).then( res =>{
                items.content = res.data.arr
                load.value = false
                console.log(res.data.arr);
            })
            // let reg = /out_trade_no=\d+/g

            // let regNum = /\d+/g

            // const result = location.hash.match(reg)[0].match( regNum )[0]

            // console.log(result);
        }) 

        function Pay( ) {
            
            const id = props.array

            let arr = [ ]

            id.map( item =>{
                arr.push( item.id )
            } ) 
            console.log(location);
            axios({
                url:"http://localhost:8088/pay",
                data:{
                    money: id.length * items.content.price ,
                    subject: items.content.name,
                    content: JSON.stringify( arr ),
                    url:location.origin + "/#/confirmOrder",
                    filmId:items.content.id
                },
                method:"POST",
                headers:{
                    Authorization:`Bearer ${ sessionStorage.getItem("token") }`
                }
            }).then( res =>{
                if( res.data.status == 300 ){
                    confirmBox("你有未支付的订单","购票提示")
                }
                if( res.data.status == 301 ){
                    confirmBox("座位已出售","购票提示")
                }else{
                    loading( "拉起支付中" )
                    location.href = JSON.parse( res.data.url )
                }
            } )
        }

        return {
            items,
            load,
            Pay
        }
    }
}
</script>

<style lang="less" scoped>
div{
    display: flex;
    width: 100%;
    padding: 20px;
    height: 650px;
    background-color: rgb(225, 216, 216);
    border-radius: 10px;
    flex-direction: column;
    align-items: center;
    h5{
        white-space: normal;
        word-break: break-all;
    }

    img{
        width: 80%;
        height: 200px;
        border-radius: 5px;
    }
    ul{ 
        li{ 
            margin: 1px;
            padding: 2px;
            font-family: 隶书;
            font-size: 18px;
        }
    }

}
</style>