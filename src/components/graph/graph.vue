<template>
    <div>

        <div id="bar-chart"></div>
        <div id="pie-chart"></div>
        <div id="bar-chart-academy"></div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import * as echarts from "echarts"; // 引入 ECharts
import { reactive, watch } from "vue";
import axios from 'axios';
import { AdminService } from '../../services/AdminService.ts'
// import { jwtDecode } from 'jwt-decode';
// import { response } from "express";
// import { r as Cl } from "../assets/js/request-BE1UvMV5.js";
// import { r as h2, a0 as v2, A as Dl, c as c2, a as Rt, t as Ml, o as p2 } from "../assets/js/index-HHlgu3jn.js";
// 响应式数据
let repairLab = ref();
let leisureLab = ref();
let useLab = ref();
let form = reactive({
    week: ''
})
let weekArray = reactive([])
let labNames = reactive([])
let leisureEquipments = reactive([])
let useEquipments = reactive([])

// 提取错误处理函数
const handleError = (error) => {
    if (error.response) {
        console.error("响应错误:", error.response);
    } else if (error.request) {
        console.error("没有收到响应:", error.request);
    } else {
        console.error("请求错误:", error.message);
    }
};
const second = async () => {
    try {
        console.log(sessionStorage.getItem('token'));
        const request = await AdminService.getGraph2();
        const data = request;
        if (data) {
            for (let i = 0; i < 3; i++) {
                if (data[i].state === 0) {
                    repairLab.value = data[i].quantity;
                } else if (data[i].state === 1) {
                    leisureLab.value = data[i].quantity;
                } else {
                    useLab.value = data[i].quantity;
                }
                initCharts()
            }
        } else {
            console.error("返回的数据格式不正确，缺少 data 字段");
        }
    } catch (error) {
        handleError(error);
    }
};

const third = async () => {
    try {
        const request = await AdminService.getGraph3();
        const data = request;
        if (data) {
            data.forEach(item => {
                weekArray.push(item.quantity);
            });
            initCharts()
        } else {
            console.error("返回的数据格式不正确，缺少 data 字段");
        }
    } catch (error) {
        handleError(error);
    }
};

const first = async () => {
    try {
        const request = await AdminService.getGraph1();
        const data = request.enableEquipmentCountList;
        if (data) {
            data.forEach(item => {
                labNames.push(item.name);
                leisureEquipments.push(item.enableQuantity);
                useEquipments.push(item.unableQuantity);
                initCharts()
            });
        } else {
            console.error("返回的数据格式不正确，缺少 data 字段");
        }
    } catch (error) {
        handleError(error);
    }
};
function getData() {
    second().then(() => third()).then(() => first());
}
// 配置图表的参数
const barChartOptions = ref({
    title: {
        text: "当前各实验室不同状态设备数量柱状图",
        subtext: "",
        left: "center",
    },
    tooltip: {
        trigger: "axis",
        axisPointer: {
            type: "shadow",
        },
    },
    legend: {
        data: ["空闲中", "使用中"],
        left: "left",
    },
    toolbox: {
        show: true,
        orient: "vertical",
        left: "right",
        top: "center",
        feature: {
            mark: { show: true },
            dataView: { show: true, readOnly: false },
            magicType: { show: true, type: ["line", "bar", "stack"] },
            restore: { show: true },
            saveAsImage: { show: true },
        },
    },
    xAxis: [
        {
            type: "category",
            axisTick: { show: false },
            data: labNames,
            name: "实验室名称"
        },
    ],
    yAxis: [
        {
            type: "value",
            name: "设备数量(个)",
        },
    ],
    series: [
        {
            name: "空闲中",
            type: "bar",
            label: "空闲中",
            emphasis: { focus: "series" },
            data: leisureEquipments,
        },
        {
            name: "使用中",
            type: "bar",
            label: "使用中",
            emphasis: { focus: "series" },
            data: useEquipments
        },

    ],
});

const pieChartOptions = ref({
    title: {
        text: "当前各实验室不同状态分布饼状图",
        left: "center",
    },
    tooltip: {
        trigger: "item",
    },
    legend: {
        orient: "vertical",
        left: "left",
    },
    series: [
        {
            type: "pie",
            radius: "50%",
            label: {
                show: true,
                position: "inner",
                formatter: "{d}%",
            },
            data: [
                {
                    value: repairLab,
                    name: "维修中",
                },
                {
                    value: leisureLab,
                    name: "空闲中",
                },
                {
                    value: useLab,
                    name: "使用中",
                },

            ],
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: "rgba(0, 0, 0, 0.5)",
                },
            },
        },
    ],
});

const academyBarChartOptions = ref({
    title: {
        text: "当前周各实验室占用情况柱状图",
        subtext: "",
        left: "center",
    },
    xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        name: "星期",
    },
    yAxis: {
        type: "value",
        name: "实验室数量(个)",
    },
    tooltip: {
        trigger: "item",
    },
    series: [
        {
            data: weekArray,
            type: "bar",
            itemStyle: {
                normal: {
                    color: function () {
                        return (
                            "#" +
                            Math.floor(Math.random() * (256 * 256 * 256 - 1)).toString(16)
                        );
                    },
                },
            },
        },
    ],
});

// const checkTokenExpiration = () => {
//     const token = sessionStorage.getItem('token');
//     if (token) {
//         try {
//             const decoded = jwtDecode(token);
//             const currentTime = Date.now() / 1000;
//             if (decoded.exp < currentTime) {
//                 alert("Token 已过期，请重新登录");
//                 window.location.href = '/';
//             }
//         } catch (error) {
//             console.error("无效的Token:", error);
//             alert("Token 无效，请重新登录");
//             window.location.href = '/';
//         }
//     } else {
//         alert("未找到 Token,请重新登录");
//         window.location.href = '/';
//     }
// };
let barChart, pieChart, academyBarChart;
// 初始化 ECharts 图表
const initCharts = () => {
    if (!barChart) {
        barChart = echarts.init(document.getElementById("bar-chart"));
    }
    if (!pieChart) {
        pieChart = echarts.init(document.getElementById("pie-chart"));
    }
    if (!academyBarChart) {
        academyBarChart = echarts.init(document.getElementById("bar-chart-academy"));
    }
    barChart.setOption(barChartOptions.value, false);
    pieChart.setOption(pieChartOptions.value, false);
    academyBarChart.setOption(academyBarChartOptions.value, false);
};
// 监听数据变化并更新图表
watch([repairLab, leisureLab, useLab, weekArray], () => {
    initCharts();
});
// 生命周期钩子
onMounted(() => {
    getData()
    initCharts();
})

</script>

<style scoped>
/* 样式 */
#bar-chart,
#pie-chart,
#bar-chart-academy {
    width: 1200px;
    height: 400px;
}
</style>
