import { defineComponent, reactive, ref, h } from "vue";
import type { FormInstance, FormRules } from "element-plus";

type FieldType = "input" | "password" | "select" | "radio" | "checkbox";

interface FormField {
  label: string;
  prop: string;
  type: FieldType;
  placeholder?: string;
  options?: { value: string; label: string }[]; // 用于 select、radio、checkbox
  required?: boolean;
  rules?: FormRules[keyof FormRules];
}

interface FormConfig {
  fields: FormField[];
  labelWidth?: string; // 表单标签宽度
  formSize?: "small" | "default" | "large"; // 表单大小
}

export function createForm(config: FormConfig) {
  return defineComponent({
    name: "DynamicForm",
    setup() {
      // 动态创建表单数据模型
      const formModel = reactive(
        config.fields.reduce((acc, field) => {
          acc[field.prop] = ""; // 默认值为空字符串
          return acc;
        }, {} as Record<string, any>)
      );

      // 动态创建验证规则
      const formRules: FormRules = {};
      config.fields.forEach((field) => {
        if (field.required) {
          formRules[field.prop] = field.rules || [
            { required: true, message: `${field.label}不能为空`, trigger: "blur" },
          ];
        }
      });

      // 表单引用
      const formRef = ref<FormInstance>();

      // 提交表单
      const handleSubmit = () => {
        formRef.value?.validate((valid) => {
          if (valid) {
            console.log("提交成功：", formModel);
          } else {
            console.error("验证失败！");
          }
        });
      };

      // 重置表单
      const handleReset = () => {
        formRef.value?.resetFields();
      };

      // 渲染表单项
      const renderFormItem = (field: FormField) => {
        switch (field.type) {
          case "input":
            return h("el-input", {
              modelValue: formModel[field.prop],
              "onUpdate:modelValue": (value: string) => (formModel[field.prop] = value),
              placeholder: field.placeholder,
            });
          case "password":
            return h("el-input", {
              modelValue: formModel[field.prop],
              "onUpdate:modelValue": (value: string) => (formModel[field.prop] = value),
              type: "password",
              showPassword: true,
              placeholder: field.placeholder,
            });
          case "select":
            return h(
              "el-select",
              {
                modelValue: formModel[field.prop],
                "onUpdate:modelValue": (value: string) => (formModel[field.prop] = value),
                placeholder: field.placeholder,
              },
              field.options?.map((option) =>
                h("el-option", { key: option.value, label: option.label, value: option.value })
              )
            );
          case "radio":
            return h(
              "el-radio-group",
              {
                modelValue: formModel[field.prop],
                "onUpdate:modelValue": (value: string) => (formModel[field.prop] = value),
              },
              field.options?.map((option) =>
                h("el-radio", { key: option.value, label: option.value }, () => option.label)
              )
            );
          case "checkbox":
            return h(
              "el-checkbox-group",
              {
                modelValue: formModel[field.prop],
                "onUpdate:modelValue": (value: string[]) => (formModel[field.prop] = value),
              },
              field.options?.map((option) =>
                h("el-checkbox", { key: option.value, label: option.value }, () => option.label)
              )
            );
          default:
            return null;
        }
      };

      // 渲染表单组件
      return () =>
        h(
          "el-form",
          {
            ref: formRef,
            model: formModel,
            rules: formRules,
            labelWidth: config.labelWidth || "120px",
            size: config.formSize || "default",
          },
          [
            ...config.fields.map((field) =>
              h(
                "el-form-item",
                { label: field.label, prop: field.prop },
                { default: () => renderFormItem(field) }
              )
            ),
            h("el-form-item", null, {
              default: () => [
                h(
                  "el-button",
                  { type: "primary", onClick: handleSubmit },
                  { default: () => "提交" }
                ),
                h("el-button", { onClick: handleReset }, { default: () => "重置" }),
              ],
            }),
          ]
        );
    },
  });
}