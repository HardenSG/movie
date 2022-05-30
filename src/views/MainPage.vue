<template>
  <div class="common-layout">
    <el-container>
      <el-header>
        <HeaderSecVue></HeaderSecVue>
      </el-header>
      <el-main class="Main">
          <!-- <transition
            name="animate__animated animate__bounce "
            enter-active-class="animate__fadeIn"
          > -->
            <router-view v-slot="{ Component }">
              <keep-alive include="IndexCom,TopCom">
                <component :is="Component"></component>
              </keep-alive>
            </router-view>
          <!-- </transition> -->
      </el-main>
    </el-container>
  </div>
</template>

<script>
import HeaderSecVue from "@/views/HeaderSec.vue";
import 'animate.css';

export default {
  components: {
    HeaderSecVue,
  },
};
</script>

<style>
</style>