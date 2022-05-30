<template>
  <el-input v-model="input" placeholder="Please input" class="input" @keydown.enter="filterData"/>
  <el-select v-model="selectValue" placeholder="Select">
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    />
  </el-select>
  <el-table
    :data="tableData"
    height="550"
    style="width: 100%"
    v-loading="load"
    @row-click="LookOrder"
    :default-sort="{ prop: 'orderTime', order: 'descending' }"
  >
    <el-table-column prop="orderId" label="订单号" width="180" />
    <el-table-column prop="status" label="状态" width="180" />
    <el-table-column prop="subject" label="电影" width="180" />
    <el-table-column prop="content" label="座位" width="180" />
    <el-table-column prop="orderTime" label="支付时间" />
    <el-table-column>
      <template #default="scope">
        <el-button
          type="danger"
          plain
          @click="GoToPay(scope.$index, scope.row)"
          v-if="scope.row.status == '未支付'"
          >去支付</el-button
        >
        <el-button
          type="danger"
          plain
          @click="GoToCancel(scope.$index, scope.row)"
          v-if="scope.row.status == '未支付'"
          >取消订单</el-button
        >
      </template>
    </el-table-column>
  </el-table>
  <el-drawer v-model="visible" :show-close="false">
    <template #header="{ titleId, titleClass }">
      <h4 :id="titleId" :class="titleClass">订单详细</h4>
    </template>
    <el-card class="box-card">
      <template #header>
        <div class="card-header">
          <span>名称： {{ dialogOrder[0].subject }}</span>
        </div>
      </template>
      <div class="text item">座位: {{ dialogOrder[0].content }}</div>
      <div class="text item">订单流水号:{{ dialogOrder[0].orderId }}</div>
      <div class="text item">支付状态:{{ dialogOrder[0].status }}</div>
      <div class="text item" v-if="dialogOrder[0].orderTime">
        支付时间:{{ dialogOrder[0].orderTime }}
      </div>
    </el-card>
  </el-drawer>
</template>

<script>
import axios from "axios";
import { reactive, ref } from "@vue/reactivity";
import { onBeforeMount, watch } from "@vue/runtime-core";
import { confirmBox, loading, warning } from "@/utils/popBox";

export default {
  name: "PersonOrder",
  setup() {
    let load = ref(true);

    let tableData = reactive([]);

    let selectValue = ref("");

    let filters = []

    //筛选的文字
    let input = ref("")

    //下拉框的配置
    let options = reactive([
      {
        value: "id",
        label: "订单号",
      },
      {
        value: "status",
        label: "状态",
      },
      {
        value: "name",
        label: "电影名称",
      }
    ]);

    //遮罩层是否可见，弹框是否出现
    const visible = ref(false);

    //展示给弹框的数据
    let dialogOrder = reactive([]);

    //获取订单请求
    function getOrder() {
      !load.value ? (load.value = true) : 1;
      axios({
        url: "http://localhost:8088/getOrder",
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`,
        },
      }).then((res) => {
        tableData.push(...res.data.arr);
        filters.push(...res.data.arr)
        load.value = false;
      });
    }

    onBeforeMount(() => {
      getOrder();
    });

    //支付
    function GoToPay(row, data) {
      const url = data.url;

      loading("拉起支付中！");

      location.href = url;
    }

    //取消订单
    function GoToCancel(row, data) {
      const url = data.url;

      axios({
        url: "http://localhost:8088/api/cancelOrder",
        method: "POST",
        data: {
          url,
        },
      }).then((res) => {
        if (res.data.status == 200) {
          warning("取消订单", res.data.msg);

          //先将内容清空
          tableData.splice(0, tableData.length);

          //调用请求
          getOrder();
        }
      });
    }

    //查看订单详细
    function LookOrder(a) {
      //清空展示对象内容
      dialogOrder.splice(0, 1);

      //将数据放进展示的对象上
      dialogOrder.push(a);

      visible.value = true;
    }

    //筛选订单
    function filterData( ) {
      if( selectValue.value =="" ) {
        warning("筛选提醒","你还没有选择查找类型") 
        return
      }
      if( input.value.trim( ) =="" ) return 

      const fil = flag =>{

        const a = filters.filter( item => item[flag] == input.value)

        tableData.splice(0,tableData.length)

        tableData.push( ...a )

        console.log(tableData);
      }

      switch( selectValue.value ){
        case "id":{
          fil( "orderId" )
          break
        }
        case "status":{
          fil("status")
          break
        }
        case "name":{
          fil("subject")
          break
        }
      }


    }

    watch( ( ) =>input.value ,( newValue ) =>{
      if( input.value.trim( ) == "" ) {
        tableData.splice(0,tableData.length)
        tableData.push(...filters)
      }
    })

    return {
      tableData,
      load,
      selectValue,
      input,
      options,
      visible,
      dialogOrder,
      GoToPay,
      GoToCancel,
      LookOrder,
      filterData
    };
  },
};
</script>

<style lang="less" scoped>
.input{ 
  display: inline-block;
  width: 20%;
}
</style>