<template>
  <component :is='com'></component>
</template>

<script>
import { computed, defineAsyncComponent, onBeforeMount } from '@vue/runtime-core'
import { useStore } from 'vuex'
import axios from 'axios'

const log = defineAsyncComponent( ( ) => import("@/views/LogCom.vue") )
const main = defineAsyncComponent( ( ) => import("@/views/MainPage.vue") )


export default {
  name: 'App',
  setup( ) {

    const store = useStore( )

    let com = computed( ( ) => {
      switch( store.state.logFlag ){
        case true:{
          return main
        }
        case false:{
          return log
        }
      }
    } )

    onBeforeMount( ( ) =>{
      const token = sessionStorage.getItem("token")
      if ( token ) {
        axios({
          url:"http://36.133.40.168:8082/tokenLogin",
          method:"POST",
          headers:{
            Authorization:`Bearer ${ token }`
          }
        }).then( res =>{
          store.commit("handleLogin",res.data)
        } )
      }
    } ) 


    return {
      com,
    }
  }
}
</script>

<style lang="less">
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}


body{ 
  overflow-x:hidden ;
  overflow-y: scroll;
}

::-webkit-scrollbar {
    width: 0px;
  }

@font-face {
  font-family: 'iconfont';  /* project id 3433368 */
  src: url('');
  src: url('?#iefix') format('embedded-opentype'),
  url('http://at.alicdn.com/t/font_3433368_yaigcdkdtt.woff2') format('woff2'),
  url('http://at.alicdn.com/t/font_3433368_yaigcdkdtt.woff') format('woff'),
  url('http://at.alicdn.com/t/font_3433368_yaigcdkdtt.ttf') format('truetype'),
  url('#iconfont') format('svg');
}
.iconfont {
  font-family: "iconfont" !important;
  font-size: 25px;
  color: rgb(220, 223, 220);
  user-select: none;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
}

a{
  text-decoration: none;
  color: black;
  &:hover{
    color: red;
  }
}
ul{
  list-style: none;
}
</style>
