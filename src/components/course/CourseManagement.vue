<template>
  <div>
    <div style="text-align: center;display: flex;">
      <el-button @click="add" type="primary">新增</el-button>
      <!-- 批量删除按钮 -->
      <el-button @click="handleBatchDelete" type="danger" :disabled="selectedRows.length === 0"
        style="margin-left: 50px;">批量删除</el-button>
    </div>
    <el-table v-show="tableData.length > 0" :data="currentPageData"
      :default-sort="{ prop: 'name', order: 'descending' }" style="width: 100%;height: 100%;"
      @selection-change="handleSelectionChange">
      <el-table-column label="box" type="selection" width="60">
      </el-table-column>
      <el-table-column prop="name" label="name" sortable width="220">
      </el-table-column>
      <el-table-column prop="type" label="type" width="100" />
      <el-table-column prop="clazz" label="clazz" width="200" />
      <el-table-column prop="semester" label="semester" width="150" />
      <el-table-column prop="quantity" label="quantity" width="130" />
      <el-table-column prop="experimentHour" label="experimentHour" width="150" :show-overflow-tooltip="true" />
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
    <div>
      <el-dialog title="编辑课程" v-model="dialogVisible" width="30%">
        <el-form :model="formData" label-width="100px">
          <el-form-item label="name" label-width="120">
            <el-input v-model="formData.name"></el-input>
          </el-form-item>
          <el-form-item label="type" label-width="120">
            <el-input v-model="formData.type"></el-input>
          </el-form-item>
          <el-form-item label="clazz" label-width="120">
            <el-input v-model="formData.clazz"></el-input>
          </el-form-item>
          <el-form-item label="semester" label-width="120">
            <el-input v-model="formData.semester"></el-input>
          </el-form-item>
          <el-form-item label="quantity" label-width="120">
            <el-input type="text" v-model="formData.quantity"></el-input>
          </el-form-item>
          <el-form-item label="experimentHour" label-width="120">
            <el-input type="text" v-model="formData.experimentHour"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="handleSave">确认</el-button>
        </div>
      </el-dialog>
    </div>

    <!-- 新增 -->
    <el-dialog title="编辑课程" v-model="dialogFormVisible" width="30%">
      <el-form :model="form" label-width="100px">
        <el-form-item label="name" label-width="120">
          <el-input v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>
        <el-form-item label="type" label-width="120">
          <el-input v-model="form.type" placeholder="请输入类型"></el-input>
        </el-form-item>
        <el-form-item label="clazz" label-width="120">
          <el-input v-model="form.clazz" placeholder="请输入班级"></el-input>
        </el-form-item>
        <el-form-item label="semester" label-width="120">
          <el-input v-model="form.semester" placeholder="请输入学期"></el-input>
        </el-form-item>
        <el-form-item label="quantity" label-width="120">
          <el-input type="text" v-model="form.quantity" placeholder="请输入人数"></el-input>
        </el-form-item>
        <el-form-item label="experimentHour" label-width="120">
          <el-input type="text" v-model="form.experimentHour" placeholder="请输入学时"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleDialogCloseTable">取消</el-button>
        <el-button type="primary" @click="handleSaveTable">确认</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script setup lang="ts">
// import  { TableColumnCtx } from 'element-plus'
import { reactive, ref, computed } from 'vue';
import { TeacherService } from '@/services/TeacherService.ts'
import { Failed, ChatDotSquare } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

let dialogVisible = ref(false);
let dialogFormVisible = ref(false)
let currentPage = ref(1);
let pagerCountValue = ref(8);
let pageSize = ref(8)
let total = ref(0)
const tableData: any = reactive([]);
const formData = reactive({
  id: '',
  name: '',
  type: '',
  quantity: '',
  experimentHour: '',
  clazz: '',
  semester: ''
});
const form = reactive({
  name: '',
  type: '',
  quantity: '',
  experimentHour: '',
  clazz: '',
  semester: '',
  teacherId: ''
});




// let modal = ref(true)
let selectedRows: any = ref([]); // 用于存储选中的行
const add = async () => {
  console.log("进入add");
  dialogFormVisible.value = true
  console.log(dialogFormVisible.value);
 
  console.log("form", form);
}


const addBatch = (row) => {
  console.log("addBatch");
  if (selectedRows.value.includes(row)) {
    selectedRows.value = selectedRows.value.filter(item => item !== row);
  } else {
    selectedRows.value.push(row);
  }
  console.log(selectedRows.value);
}
const handleSelectionChange = (val) => {
  selectedRows.value = val;  // val 是选中的行数据
  console.log('选中的行:', selectedRows.value);
};
// 批量删除
const handleBatchDelete = async () => {
  console.log("进入批量删除");
  let rows = selectedRows.value;
  console.log(rows);
  try {
    if (rows.length > 0) {
      const idsToDelete = rows.map((row:any) => row.id).filter((id:any) => id);
      console.log(idsToDelete);
      
      if (idsToDelete.length > 0) {
        for (let i = 0; i < idsToDelete.length;i++) {
          let tid = sessionStorage.getItem('uid')
          const appointments = await TeacherService.EnableDeleteService(tid, idsToDelete[i]);
          if (appointments) {
            ElMessage.error('当前课程有预约记录,不能删除!!');
          }
        }
        await TeacherService.deleteCoursesService(idsToDelete);
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


const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return tableData.slice(start, end);
});

const fetchData = async () => {
  try {
    tableData.length = 0;  // 清空 tableData
    const res: any = await TeacherService.listCoursesService();
    console.log("res:",res);
    for (let i = 0; i < res.value.length; i++){
      if (!res.value[i].id) {
        console.error('数据缺少id属性:', res.value[i]);
        return;
      }
      tableData.push(res.value[i]);
    }
    // res.forEach((item: any) => {
    //   if (!item.id) {
    //     console.error('数据缺少id属性:', item);
    //     return;
    //   }
    //   tableData.push(item);
    // });
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
  formData.id = row.id;
  formData.clazz = row.clazz;
  formData.experimentHour = row.experimentHour;
  formData.name = row.name;
  formData.quantity = row.quantity;
  formData.type = row.type;
  formData.semester = row.semester;
  dialogVisible.value = true;
  console.log(dialogVisible.value);


};

const handleDelete = async (row) => {
  try {
    console.log(row.id);
    let tid = sessionStorage.getItem('uid')
    const appointments = await TeacherService.EnableDeleteService(tid, row.id);
    if (appointments) {
      ElMessage.error("当前课程有预约记录!!!!");
    }
    const deleteId = await TeacherService.deleteCourseService(row.id);
    console.log(deleteId);
    
      fetchData();
      ElMessage.success("删除成功!!!!" );
    
  } catch (error) {
    ElMessage.error('Error deleting news:');
  }
};

const handleSave = async () => {
  try {
    if (formData.id) {
      await TeacherService.updateCourseService(formData);
    } else {
      console.log("id不存在");
      
    }
    dialogVisible.value = false;
    fetchData();
  } catch (error) {
    console.error('Error saving news:', error);
  }
  // fetchData()
};

const handleDialogCloseTable = () => {
  form.clazz = '';
  form.experimentHour = '';
  form.quantity = '';
  form.type = '';
  form.name = '';
  form.semester = '';
  dialogFormVisible.value = false;
};
let teacher1 = {
  id: '',
  name: '',
  type: '',
  quantity: '',
  experimentHour: '',
  clazz: '',
  semester: ''
}
const handleSaveTable = async () => {
  try {
    if (form.clazz && form.experimentHour && form.name && form.quantity) {
      let teacher = sessionStorage.getItem('user')
      teacher1 = JSON.parse(teacher!);
      form.teacherId = teacher1.id!
      // console.log(tid);
      const res: any = await TeacherService.addCourseService(form);
      console.log(res);
 
     
      ElMessage.success("添加成功!!!!");
      await fetchData()
      dialogFormVisible.value = false; 
   
    } else {
      console.log("数据不完整");
    }
  } catch (error) {
    console.error('Error adding news:', error);
  }
};
const handleDialogClose = () => {
  formData.id = '';
  formData.clazz = '';
  formData.experimentHour = '';
  formData.name ='';
  formData.quantity = '';
  formData.type = '';
  formData.semester = '';
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