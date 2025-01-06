import { shallowRef } from "vue";
import { type Course } from "@/types/index";
import { useDelete, useGet, usePost,usePatch ,usePut} from "@/axios";

// 该老师的全部课程
const coursesS = shallowRef<Course[]>();
const getCourses =async ()=> {
    coursesS.value = await useGet(`users/courses`);
}
const clear = () => (coursesS.value = undefined);
const store = { coursesS, clear };
export const useCoursesStore = () => store;
