<script setup lang="ts">
import UserManager from '../../../components/user/UserManager.vue'
import { Platform, Menu as IconMenu, Edit, TrendCharts, ChatLineRound } from '@element-plus/icons-vue'
import Header from '../../../components/layout/Header.vue'
import Menu from '../../../components/layout/Menu.vue'
const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
import { type Component, ref } from "vue";
import { ElSubMenu, ElMenuItem } from "element-plus";
import { House } from "@element-plus/icons-vue";
import router from "@/router";
const defaultActive = ref<string>(router.currentRoute.value.path);
interface MenuItem {
  id: number;
  name: string;
  index: string;
  icon?: Component;
  children?: MenuItem[];
}
const menulist: MenuItem[] = [
  {
    id: 1,
    name: "公告管理",
    index: "/labadmin/noticemanager",
    icon: House,
  }
];
</script>
<template>
  <Header />
  <div id="menu">
    <!-- 使用router会在激活导航的时候以index作为path进行路由跳转 -->
    <el-menu active-text-color="#fff" background-color="#2b2c44" class="el-menu-vertical-demo"
      :default-active="defaultActive" text-color="#fff" router>
      <component :is="item.children ? ElSubMenu : ElMenuItem" v-for="item in menulist" :key="item.id"
        :index="item.index">
        <template v-if="item.children" #title>
          <!-- <el-icon v-if="item.icon">
              <component :is="item.icon">
              </component>
            </el-icon> -->
          <span>{{ item.name }}</span>
        </template>
        <span v-if="!item.children">
          <!-- <el-icon v-if="item.icon">
              <component :is="item.icon">
              </component>
            </el-icon> -->
          <span>{{ item.name }}</span>
        </span>
        <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.index">
          {{ subItem.name }}
        </el-menu-item>
      </component>
    </el-menu>
  </div>
  <RouterView id="routerview"></RouterView>
</template>
<style scoped>
* {
  margin: 0;
  padding: 0;
}

#menu {
  width: 100px;
}

.contain {
  display: flex;
  height: 100vh;
  width: 100vw;
}

.left-head {
  position: absolute;
  left: 10px;
  margin-bottom: 18px;
  margin-top: 18px;
  color: black;
  z-index: 222;

}

.left-nav {
  /* position: absolute; */
  left: 0px;
  top: 0px;
  background-color: #7eaa92;
  width: 164px;
  height: 170vh;
}

.right {
  flex-grow: 1;
  padding: 20px;
}


.right-head {
  cursor: pointer;
  /* width: 800px; */
  height: 50px;
  top: -15px;

  /* margin-left: 350px; */
}

.right-head-title {
  position: absolute;
  right: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.right-head .avatar {
  margin-right: 5px;
  /* display: inline-block; */
}


.right-head ul {
  display: none;
  list-style: none;
  flex-direction: column;
  align-items: center;
  position: absolute;
  top: 100%;
  right: 0;
  padding: 10px 0;
  width: 80%;

}

.right-head ul li {
  margin: 8px;
  padding: 5px 10px;
  width: 100%;
  text-align: center;
}

.right-head span:hover,
.right-head ul li:hover {
  color: rgb(240, 172, 83);
}

.right-head-title:hover ul {
  display: flex;
  z-index: 222;
}

#routerview {
  width: 85%;
  height: 85%;
  margin: 50px;
}

router-link {
  text-decoration: none;
}

span {
  text-decoration: none;
}
</style>
