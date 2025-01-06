import { shallowRef } from "vue";

const labs = shallowRef();
const clean = () => (labs.value = undefined);
const store = { labs, clean };
export const useLabsStore = () => store;
