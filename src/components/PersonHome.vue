<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
          <ul class="tabBar">
              <li v-for="a in aside" :key="a.path" @click="tagSupense( a.path )">
                {{ a.tag }}
              </li>
          </ul>
      </el-aside>
      <el-main>
            <component :is='endFlag'></component>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity'
import { computed, defineAsyncComponent } from '@vue/runtime-core'

//异步组件，配合comis
const me = defineAsyncComponent( ( ) => import("@/components/person/PersonMe.vue") )
const order = defineAsyncComponent( ( ) => import("@/components/person/PersonOrder.vue") )

export default {
    name:"PersonHome",

    setup( ) {

        let flag = ref( "me" )

        let aside = reactive([
            {
                tag:"我的",
                path:"me"
            },
            {
                tag:"我的订单",
                path:"order"
            }
        ])

        let endFlag = computed( ( ) =>{
            switch( flag.value ){
                case "me":{
                    return me
                }
                case "order":{
                    return order
                }
            }
        } )

        function tagSupense( path ){
            flag.value = path
        }


        return{
            aside,
            endFlag,
            tagSupense,
        }
    },


}
</script>

<style lang="less" scoped>
.tabBar { 
    width: 100%;
    height: 600px;
    padding: 10px;
    background-color: rgb(213, 209, 209);
    border-radius: 7px;
    li{ 
        display: flex;
        width: 100%;
        height: 50px;
        // background-color: #666;
        border-radius: 8px;
        transition: .2s;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        &:hover{ 
            background-color: #fff;
        }
    }
}


.main{ 
    width: 100%;
    height: 500px;
    background-color: #999;
}
</style>