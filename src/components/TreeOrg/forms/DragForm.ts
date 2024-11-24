
import { defineComponent } from "vue";
import { createForm } from "./index";

export const formA=defineComponent({
  name: "a",
  components: {
    DynamicForm: createForm({
      fields: [
        {
          label: "用户名",
          prop: "username",
          type: "input",
          placeholder: "请输入用户名",
          required: true,
        },
        {
          label: "密码",
          prop: "password",
          type: "password",
          placeholder: "请输入密码",
          required: true,
          rules: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { min: 6, message: "密码长度至少为6个字符", trigger: "blur" },
          ],
        },
        {
          label: "性别",
          prop: "gender",
          type: "radio",
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
          ],
          required: true,
        },
        {
          label: "国家",
          prop: "country",
          type: "select",
          options: [
            { value: "china", label: "中国" },
            { value: "usa", label: "美国" },
            { value: "japan", label: "日本" },
          ],
          placeholder: "请选择国家",
          required: true,
        },
      ],
      labelWidth: "150px",
      formSize: "default",
    }),
  },
});


export const formB=defineComponent({
  name: "b",
  components: {
    DynamicForm: createForm({
      fields: [
        {
          label: "用户名",
          prop: "username",
          type: "input",
          placeholder: "请输入用户名",
          required: true,
        },
        {
          label: "密码",
          prop: "password",
          type: "password",
          placeholder: "请输入密码",
          required: true,
          rules: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { min: 6, message: "密码长度至少为6个字符", trigger: "blur" },
          ],
        },
        {
          label: "性别",
          prop: "gender",
          type: "radio",
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
          ],
          required: true,
        },
        {
          label: "国家",
          prop: "country",
          type: "select",
          options: [
            { value: "china", label: "中国" },
            { value: "usa", label: "美国" },
            { value: "japan", label: "日本" },
          ],
          placeholder: "请选择国家",
          required: true,
        },
      ],
      labelWidth: "150px",
      formSize: "default",
    }),
  },
});


export const formC=defineComponent({
  name: "c",
  components: {
    DynamicForm: createForm({
      fields: [
        {
          label: "用户名",
          prop: "username",
          type: "input",
          placeholder: "请输入用户名",
          required: true,
        },
        {
          label: "密码",
          prop: "password",
          type: "password",
          placeholder: "请输入密码",
          required: true,
          rules: [
            { required: true, message: "密码不能为空", trigger: "blur" },
            { min: 6, message: "密码长度至少为6个字符", trigger: "blur" },
          ],
        },
        {
          label: "性别",
          prop: "gender",
          type: "radio",
          options: [
            { value: "male", label: "男" },
            { value: "female", label: "女" },
          ],
          required: true,
        },
        {
          label: "国家",
          prop: "country",
          type: "select",
          options: [
            { value: "china", label: "中国" },
            { value: "usa", label: "美国" },
            { value: "japan", label: "日本" },
          ],
          placeholder: "请选择国家",
          required: true,
        },
      ],
      labelWidth: "150px",
      formSize: "default",
    }),
  },
});

