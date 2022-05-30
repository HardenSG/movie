<template>
  <div class="container">
    <ul>
      <li v-for="a in items" :key="a.movieId">
        <h4>热度：{{ a.hots }}</h4>
        <img :src="a.img">
        <div class="intro">
          <h1>{{ a.name }}</h1>
          <h3>{{ a.movieTime }}</h3>
          <h5>排期时间：{{ a.time }}</h5>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios"
import { onBeforeMount, reactive } from '@vue/runtime-core'

export default {
    name:"TopCom",
    setup( ) {

      let items = reactive( [ ])

      onBeforeMount( ( ) =>{
        axios({
          url:"http://localhost:8088/api/getTop",
          method:"GET"
        }).then( res =>{
          items.push( ...res.data.arr )
        } )
      } )


      return {
        items
      }
    }
}
</script>

<style lang="less" scoped>
.container{ 
  width: 70%;
  height: auto;
  margin: 0 auto;
  ul{ 
    li { 
      display: flex;
      padding: 15px;
      width: 100%;
      height: 300px;
      align-items: center;
      flex-wrap: wrap;
      cursor: pointer;
      transition: .3s;
      border-radius: 10px;
      &:hover{
        box-shadow: 0 0 10px #999;
      }
      
      img { 
        height: 100%;
        margin-top: -40px;
      }
      h4 {
        // margin: 7px;
        font-size: 20px;
      }
      .intro{ 
        display: flex;
        height: 100%;
        margin: 20px;
        flex-direction: column;
        justify-content: center;
      }
    }
  }

}
</style>