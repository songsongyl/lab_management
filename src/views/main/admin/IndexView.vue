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
        name: "用户管理",
        index: "/admin/usermanager",
        icon: House,
    },
    {
        id: 2,
        name: "统计",
        index: "/admin/graph",
        icon: House,
    },
    {
        id: 3,
        name: "课程管理",
        index: "/admin/courseManager",
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
#menu{
    width: 100px;
  
}

#routerview {
    width: 85%;
    height: 85%;
    margin-left: 150px;
    margin-top: -50px;
}

router-link{
    text-decoration: none;
}
span {
    text-decoration: none;
}

</style>
