<template>
    <div>
        <div style="text-align: center;display: flex;">
            <el-button @click="add" type="primary">新增</el-button>
            <!-- 批量删除按钮 -->
            <el-button @click="handleBatchDelete" type="danger" :disabled="selectedRows.length === 0"
                style="margin-left: 50px;">批量删除</el-button>
        </div>
        <el-table v-show="tableData.length > 0" :data="currentPageData"
            :default-sort="{ prop: 'updateTime', order: 'descending' }" style="width: 100%;height: 100%;"
            @selection-change="handleSelectionChange">
            <el-table-column label="box" type="selection" width="60">
            </el-table-column>
            <el-table-column prop="updateTime" label="UpdateTime" sortable width="250">
            </el-table-column>
            <el-table-column prop="title" label="Title" width="200" />
            <el-table-column prop="author" label="Author" width="180" />
            <el-table-column prop="content" label="Content" width="200" :formatter="formatter"
                :show-overflow-tooltip="true" />

            <el-table-column label="操作" width="180">
                <template #default="{ row }">
                    <el-button @click="handleEdit(row)">
                        <el-icon color="blue">
                            <ChatDotSquare />
                        </el-icon>
                    </el-button>
                    <el-button @click="handleDelete(row)">
                        <el-icon color="red">
                            <Failed />
                        </el-icon>
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination :page-size="pageSize" background :pager-count="pagerCountValue" layout="prev, pager, next"
            :total="total" @current-change="handlePageChange" />
        <!-- 编辑模态框 -->
        <el-dialog title="编辑公告" v-model="dialogVisible">
            <el-form :model="formData" label-width="80px">

                <el-form-item label="标题" label-width="120">
                    <el-input v-model="formData.title"></el-input>
                </el-form-item>
                <el-form-item label="作者" label-width="120">
                    <el-input v-model="formData.author"></el-input>
                </el-form-item>
                <el-form-item label="内容" label-width="120">
                    <el-input type="textarea" v-model="formData.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleDialogClose">取 消</el-button>
                <el-button type="primary" @click="handleSave">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增公告" v-model="dialogFormVisible">
            <el-form :model="newForm" label-width="100px">
                <el-form-item label="author" label-width="120">
                    <el-input v-model="newForm.author" placeholder="请输入作者"></el-input>
                </el-form-item>
                <el-form-item label="title" label-width="120">
                    <el-input v-model="newForm.title" placeholder="请输入标题"></el-input>
                </el-form-item>

                <el-form-item label="content" label-width="120">
                    <el-input type="text" v-model="newForm.content" placeholder="请输入内容"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleDialogCloseTable">取 消</el-button>
                <el-button type="primary" @click="handleSaveTable">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
// import  { TableColumnCtx } from 'element-plus'
import { reactive, ref, computed } from 'vue';
import { AdminService } from '../../services/AdminService.ts'
import { CommonService } from '../../services'
import { ADMIN, TEACHER as USER } from '../../services/Const.ts'
import { Failed, ChatDotSquare } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

let dialogVisible = ref(false);
let dialogFormVisible = ref(false)
let currentPage = ref(1);
let pagerCountValue = ref(8);
let pageSize = ref(8)
let total = ref(0)
// let modal = ref(true)
let selectedRows: any = ref([]); // 用于存储选中的行
const add = async () => {
    console.log("进入add");
    if (CommonService.getRole == USER.toString) {
        ElMessage.error("无权限!!");
    }
    dialogFormVisible.value = true
    console.log(dialogFormVisible.value);
}

// const addBatch = (row) => {
//     if (selectedRows.value.includes(row)) {
//         selectedRows.value = selectedRows.value.filter(item => item !== row);
//     } else {
//         selectedRows.value.push(row);
//     }
//     console.log(selectedRows.value);

// }

// 批量删除
const handleBatchDelete = async () => {
    console.log("进入批量删除");
    console.log(selectedRows.value);
    let rows = selectedRows.value;
    if (CommonService.getRole == USER.toString) {
        ElMessage.error("无权限!!");
    }
    try {
        if (rows.length > 0) {
            const idsToDelete = rows.map((row: any) => row.id).filter((id: any) => id);
            if (idsToDelete.length > 0) {

                await AdminService.deleteNewsBatch(idsToDelete);

                fetchData();
                selectedRows.value = [];
                ElMessage.success("批量删除成功!!");
            } else {
                alert('所选项目中没有有效的id');
            }

        }
        else {
            alert('请先选择要删除的项');
        }
    } catch (error) {
        console.error('Error batch deleting news:', error);
    }
};

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
}
const formatter = (row, column) => {
    const maxLength = 10; // 设置截断长度
    const content = row.content || '';  // 默认空字符串
    if (content.length > maxLength) {
        return `${content.slice(0, maxLength)}...`;
    }
    return row.content
}
const currentPageData = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return tableData.slice(start, end);
});
const tableData: any = reactive([]);
const formData = reactive({
    id: '',
    updateTime: '',
    title: '',
    content: '',
    author: ''
});
let form = reactive({
    id: '',
    title: '',
    content: '',
    author: ''
});
let newForm = reactive({
    title: '',
    content: '',
    author: ''
});
const fetchData = async () => {
    try {
        tableData.length = 0;  // 清空 tableData
        const res: any = await AdminService.getNews();
        // tableData.length = 0;
        res.forEach((item: any) => {
            if (!item.id) {
                console.error('数据缺少id属性:', item);
                return;
            }
            item.updateTime = formatDate(item.updateTime)
            tableData.push(item);
        });
        total.value = res.length
        console.log(total.value);
        pagerCountValue.value = Math.ceil(total.value / pageSize.value);
        console.log(pagerCountValue.value);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
};
const handlePageChange = (page) => {
    currentPage.value = page;
};
const handleEdit = (row) => {
    console.log('进入handleEdit函数');
    console.log("row:" + row.id);
    if (CommonService.getRole == USER.toString) {
        ElMessage.error("无权限!!");
    }
    formData.id = row.id;
    formData.updateTime = row.updateTime;
    formData.title = row.title;
    formData.content = row.content;
    formData.author = row.author;
    dialogVisible.value = true;
    console.log(dialogVisible.value);

};

const handleDelete = async (row) => {
    try {
        console.log(row.id);
        const deleteId = await AdminService.deleteNews(row.id);
        console.log(deleteId);
        ElMessage.success("删除成功!!!!");
        if (deleteId) {
            console.log("删除id存在", deleteId);
            fetchData();
        }
        if (CommonService.getRole == USER.toString) {
            ElMessage.error("无权限!!");
        }
    } catch (error) {

        console.error('Error deleting news:', error);
    }
};
const handleSelectionChange = (val) => {
    selectedRows.value = val;  // val 是选中的行数据
    console.log('选中的行:', selectedRows.value);
};
const handleSave = async () => {
    try {

        if (formData.id) {
            form.id = formData.id
            form.content = formData.content
            form.author = formData.author
            form.title = formData.title
            await AdminService.updateNews(form);
            ElMessage.success("更新成功!!!!");
        }
        dialogVisible.value = false;
        fetchData();
    } catch (error) {
        if (CommonService.getRole == USER.toString) {
            ElMessage.error("无权限!!");
        }
        console.error('Error saving news:', error);
    }
    // fetchData()
};

const handleDialogCloseTable = () => {
    newForm.title = '';
    newForm.content = '';
    newForm.author = '';
    dialogFormVisible.value = false;
};
const handleSaveTable = async () => {
    try {
        if (newForm.title && newForm.author && newForm.content) {
            const res: any = await AdminService.addNews(newForm);
            console.log(res);
            ElMessage.success("添加成功!!!!");
            await fetchData();
            dialogFormVisible.value = false;
        }
    } catch (error) {
        console.error('Error adding news:', error);
    }
};
const handleDialogClose = () => {
    formData.id = '';
    formData.updateTime = '';
    formData.title = '';
    formData.content = '';
    formData.author = '';
    dialogVisible.value = false
};
fetchData();
</script>

<style scoped>
.custom-table {
    
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.custom-table.el-table__body tr:hover {
    background-color: #eef2f6;
}

.custom-pagination {
    margin-top: 20px;
    font-size: 14px;
    color: #333;
    background-color: #f9f9f9;
    border-radius: 5px;
    padding: 10px;
}

.custom-pagination.el-pagination__button,
.custom-pagination.el-pagination__pager {
    transition: background - color 0.3s ease;
}

.custom-pagination.el-pagination__button:hover,
.custom-pagination.el-pagination__pager:hover {
    background-color: #ddd;
}
</style>