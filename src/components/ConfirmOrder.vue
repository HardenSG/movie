<template>
  <div class="mask">
    <div class="dialog">
      <el-col :sm="24" :lg="24">
        <el-result
          icon="success"
          :title="content.content.status"
          :sub-title="content.content.subject"
        >
          <template #extra>
            <h2>{{ content.content.subject }}</h2>
            <h4>订单号：  {{ content.content.orderId  }}</h4>
            <h4>影院厅次： {{ content.content.agencyId  }}</h4>
            <h4>座位号：  {{ content.content.content }}</h4>
            <h4>上映时间：  {{ content.content.time }}</h4>
            <h4>支付时间：    {{ content.content.orderTime  }}</h4>
            <h4>支付人邮箱：{{ content.content.email }}</h4>
            <el-button type="primary">
              <router-link to="/">回到首页</router-link>
            </el-button>
          </template>
        </el-result>
      </el-col>
    </div>
  </div>
</template>

<script>
import { onBeforeMount, reactive } from "@vue/runtime-core";
import { useRouter } from "vue-router";
import axios from "axios";
export default {
  name: "ConfirmOrder",
  setup() {
    const router = useRouter();

    let content = reactive({
      content: {},
    });

    onBeforeMount(() => {
      let reg = /out_trade_no=\d+/g;
      let regNum = /\d+/g;

      const regRes = location.hash.match(reg);

      if (!regRes.length) {
        router.push({
          path: "/",
        });

        return;
      }

      const regNumRes = regRes[0].match(regNum)[0];

      axios({
        url: "http://localhost:8088/searchOrder",
        data: {
          orderId: regNumRes,
        },
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
        method: "POST",
      }).then((res) => {
        if (res.data.status == 200) {
          content.content = res.data.arr;
        }
      });
    });

    return {
      content,
    };
  },
};
</script>

<style lang="less" scoped>
.mask {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);

  .dialog {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    width: 500px;
    height: 500px;
    justify-content: center;
  }
}
  
h4{ 
  margin: 10px;
}  
</style>