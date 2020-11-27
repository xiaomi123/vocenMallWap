<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <!-- <router-view/> -->
    <loading></loading>
    <tips></tips>
    <dialogView></dialogView>
  </div>
</template>

<script>
import loading from '@/components/common/loading'
import tips from '@/components/common/tips'
import dialogView from '@/components/common/dialog'
export default {
  name: 'App',
  components:{tips,loading,dialogView},
}
</script>

<style>
@import "./assets/css/reset.css";
@import "./assets/css/vocenShop.css";
</style>
