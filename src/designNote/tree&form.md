TREE ---> FORM
<br>
1.use TREE component , open dialog option, then set props formName or formType
<br>
2.TREE component inside will emit $:EditDialog:slotForm:open with parameters arg:

```js
arg = {
  formName: 'xxx',
  formType: 'yyy',
  formData: {
    id: 0,
    name: 'zzz',
  },
};
```

<br>
3.AppBus will listen this event custom and emit EditDialog:open with parameters arg original
<br>
4.EditDialog-slotForm will listen this event custom and getDescriptionByName or getDescriptionByType to search responding description of FORM in FORM/config

<br>
5.finally will open a FORM with expected fields

FORM--->TREE
<br>
1.EditDialog-slofForm will get the inner props 'formDataRef' from 'FORM' directly
<br>
2.EditDialog-slofForm will emit $:Dialog->Tree:addNode,pass the formData to TREE