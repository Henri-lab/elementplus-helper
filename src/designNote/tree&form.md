tree ---> from
<br>
1.use tree component , open dialog option, then set props formName or formType
<br>
2.tree component inside will emit $:EditDialog:slotForm:open with parameters arg:

```js
arg = {
  formName: 'xxx',
  formType: 'edit',
  formData: {
    id: 1,
    name: 'xxx',
  },
};
```

<br>
3.AppBus will listen this event custom and emit EditDialog:open with parameters arg original
<br>
4.EditDialog will listen this event custom and getDescriptionByName or getDescriptionByType to search responding description of form in form/config
<br>
5.finally will open a form with expected fields
