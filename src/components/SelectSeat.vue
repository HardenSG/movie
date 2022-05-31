<template>
  <div>
      <el-row :gutter="20">
        <el-col :span="18"><div class="grid-content bg-purple" />
            <div class="sceen">
                <span>屏幕</span>
                <div></div>
            </div>
            <ul v-loading="load">
                <li v-for="i in items" :key="i.id">
                        <i class="iconfont selled"  v-if="i.status == 2" >&#xe606;</i>
                        <i class="iconfont" @click="Change( $event , i.seatId ,i.name )" v-if="i.status == 1">&#xe606;</i>
                        <i class="icosnfont empty"  v-if="i.status == 0">&#xe606;</i>
                </li>
            </ul>
        </el-col>
        <el-col :span="6"><div class="grid-content bg-purple" />
            <SelectMovieReport :array="targetArray" ></SelectMovieReport>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import SelectMovieReport from '@/components/SelectMovieReport'
import axios from "axios"
import { confirmBox } from "@/utils/popBox"
import { onBeforeMount, reactive ,ref  } from "vue"
import { useRoute } from 'vue-router'


export default {
    name:"SelectSeat",
    components:{
        SelectMovieReport
    },  
    setup( ) {
        let items = reactive([ ])

        let load = ref(true)

        const route = useRoute( )
        
        //作为id数组
        let targetArray = reactive([])

        //座位点击事件
        function Change( a , id , name) {

            const node = a.target

            //样式的切换
            if( node.classList.contains("green") ){
                node.classList.remove("green")
                targetArray.splice(targetArray.indexOf( id ) , 1)
                console.log(targetArray)
            }else{
                if( targetArray.length >= 5 ){
                    confirmBox( "最多选择五张","提示" )
                    return 
                }
                node.classList.add("green")
                targetArray.push( {id,name} )
                console.log(targetArray)
            }

        }

        onBeforeMount( ( ) =>{
            const id = route.params.agencyId
            axios({
                url:"http://localhost:8088/api/getSeat",
                method:"GET",
                params:{
                    agencyId:id
                }
            }).then( res => {

                //将拆分出的.data数据push进座位数组
                items.push( ...res.data.arr )
                
                load.value = false
            } )
        } )
        
        return {
            Change,
            items,
            targetArray,
            load
        }
    }



}
</script>

<style lang="less" scoped>

.sceen{
    height: 100px;
    text-align: center;

    div{
        margin: 0 auto;
        width: 700px;
        height: 30px;
        background-color: rgb(105, 99, 99);
        border-radius: 60px 60px 0 0 ;
    }
}

ul{
    display: flex;
    width: 75%;
    margin: 0 auto;
    flex-wrap: wrap;
    li{
        width: 40px;
        margin: 20px;
        text-align: center;
        user-select: none;
    }
}


//样式添加
.green{
    color:green;
}
.selled{
    color: rgb(203, 77, 77);
}
.empty{
    color: rgb(255, 255, 255) !important;
}
</style>