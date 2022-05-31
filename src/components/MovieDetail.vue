<template>
  <div v-loading="load">
    <el-row :gutter="20" class="row">
      <el-col :span="6" :offset="4" class="col">
        <img :src="items.content.img" alt="" />
        <div class="msg">
          <span>{{ items.content.name }}</span>
          <i>{{ items.content.tag }}</i>
          <i>{{ items.content.time }}</i>
          <el-button type="danger" plain @click="goToSelect"
            >前往购票</el-button
          >
        </div>
      </el-col>
      <el-col :span="24" class="intro">
        {{ items.content.introduce }}
      </el-col>
      <div class="sendComment">
        <el-input
          v-model="input"
          placeholder="Please input"
          class="input"
          @keydown.enter="sendComment"
        />
      </div>
      <div class="detailComment" v-loading="commentLoad">
        <div
          class="firstComment"
          v-for="p in comment.content"
          :key="p.commentId"
        >
          <img :src="p.user_headerAdv" />
          <router-link to="/" class="name">{{ p.user_name }}</router-link>
          <span class="time">
            {{ p.time }}
          </span>
          <span class="content" @click="SecondComment(p.commentId)">
            {{ p.content }}
          </span>
          <el-button type="danger" class="time" plain @click="dropComment( p.commentId )">删除评论</el-button>
          <!-- 二级评论 -->
          <div
            class="secondComment"
            v-for="p1 in p.childComment"
            :key="p1.commentId"
          >
            <router-link to="/" class="secondName">
              {{ p.user_name }}:
            </router-link>
            <span class="secondcontent">
              {{ p1.content }}
            </span>
            <span class="time">
              {{ p1.time }}
            </span>
            <el-button type="danger" plain @click="dropComment( p1.commentId )">删除评论</el-button>
          </div>
        </div>
      </div>
    </el-row>
  </div>
</template>

<script>
import { onBeforeMount , reactive, ref } from "@vue/runtime-core";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { InputBox , warning } from "@/utils/popBox";

export default {
  name: "MovieDetail",
  setup() {
    let items = reactive({
      content: {},
    });

    let comment = reactive({
      content: {},
    });

    //评论输入框值
    let input = ref("");

    //页面加载的load
    let load = ref(true);

    //评论加载的load
    let commentLoad = ref(true);

    //router和route
    const router = useRouter();
    const route = useRoute();

    //路由params
    const id = route.params.id;

    //receive 电影的detail信息
    onBeforeMount(() => {
        //send 电影详细的请求
        axios({
            url: "http://localhost:8088/api/getMovieDetail",
            params: {
            id,
            },
        }).then((res) => {
            items.content = res.data.arr;
            load.value = false;
        });

        //send 评论的请求
        getComment( )
    });

    //发送接收评论信息的方法
    function getComment ( ) {
        commentLoad.value = true;
        axios({
            url: "http://localhost:8088/api/getComment",
            method: "GET",
            params: {
            filmId: id,
            },
        }).then((res) => {
            comment.content = res.data.arr;
            commentLoad.value = false;
        });
    }

    //跳转选座界面
    function goToSelect() {
      router.push({
        name: "payseat",
        params: {
          agencyId: items.content.agencyId,
          id,
        },
      });
    }

    //发送评论
    function sendComment() {
      axios({
        url: "http://localhost:8088/sendComment",
        method: "POST",
        data: {
          content: input.value,
          time:
            new Date().toLocaleDateString() +
            "-" +
            new Date().toLocaleTimeString(),
          filmId: id,
          originId: -1,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }).then((res) => {
        if (res.data.status == 200) {
            input.value = ""
            warning("评论提醒", res.data.msg);
            getComment( )
        }
      });
    }

    //二级评论
    async function SecondComment( originId ) {

        const a = await InputBox( )
        
        if( a instanceof Object ){

            //解构出
            const { value } = a

            axios({
                url: "http://localhost:8088/sendComment",
                method: "POST",
                data: {
                    content: value,
                    time:
                    new Date().toLocaleDateString() +
                    "-" +
                    new Date().toLocaleTimeString(),
                    filmId: id,
                    originId
                },
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`,
                },
            }).then((res) => {
                if (res.data.status == 200) {
                    warning("评论提醒", res.data.msg);
                    getComment( )
                }
            });
    }
    }   

    // 删除评论
    function dropComment( commentId ) {
        axios({
            url:"http://localhost:8088/api/dropComment",
            method:"POST",
            data:{
                id:commentId
            }
        }).then( res =>{
            if( res.data.status == 200 ){
                warning("删除提醒",res.data.msg)
                getComment( )
            }
        })
    }

    return {
      items,
      load,
      comment,
      commentLoad,
      input,
      goToSelect,
      sendComment,
      SecondComment,
      dropComment
    };
  },
};
</script>

<style lang="less" scoped>
.row {
  // margin-top: 50px;
  padding: 50px;
  background-image: linear-gradient(to right bottom, #605b5b, #4a4b45, #1d2461);
}

.col {
  display: flex;

  img {
    width: 200px;
  }

  .msg {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px;
    span,
    i {
      display: inline-block;
      margin: 10px;
      vertical-align: top;
      color: white;
      font-size: 24px;
      font-weight: 700;
    }
    i {
      font-size: 16px;
      font-style: normal;
    }
  }
}

.intro {
  height: 300px;
  margin: 10px;
  padding: 30px;
  border-top: 2px solid white;
  color: white;
  font-size: 20px;
}
.detailComment {
  width: 100%;
  height: 400px;
  padding: 20px;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  .firstComment {
    display: flex;
    width: 100%;
    height: auto;
    padding: 10px;
    margin-top: 20px;
    border-radius: 5px;
    background-color: rgb(129, 126, 126);
    align-content: center;
    flex-wrap: wrap;
    flex-direction: row;
    img {
      width: 40px;
      height: 40px;
      border-radius: 10px;
    }
    .name {
      position: relative;
      font-size: 18px;
      font-weight: 700;
      margin-left: 20px;
      &:hover {
        color: rgb(52, 50, 50);
      }
    }
    .content {
      width: 100%;
      height: auto;
      margin-left: 50px;
      margin-top: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      white-space: normal;
      word-break: break-all;
    }
    .time {
      width: 200px;
      margin-left: auto;
    }
    .secondComment {
      display: flex;
      width: 85%;
      height: auto;
      margin-left: 60px;
      margin-top: 10px;
      border-left: 3px solid rgb(241, 237, 237);
      .secondName {
        width: 100px;
        font-weight: 700;
        font-size: 16px;
        &:hover {
          color: rgb(52, 50, 50);
        }
      }
      .secondcontent {
        width: 90%;
        display: inline-block;
        padding: 5px 0px 5px 5px;
      }
    }
  }
  // detail结束
}

.sendComment {
  display: flex;
  align-items: center;
  padding: 10px;
  height: 80px;
  border-radius: 15px;
  margin-bottom: 15px;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.3);
}
</style>