Chart
====

���������� ��� ����������� svg-��������

**�����������**
```js
let elem = document.querySelector('#chart');
const params = {
   // ������ ��������
   data: [
       // ������ �������� �������
       [0, 1, 2, 0],
   ]
};
new Chart(elem, params);
```

**�������������� ���������**
```js
const params = {
    // ������ ��������
    data: [
        // ������ �������� �������
        [0, 1, 2, 0],
    ],

    // ������ �������� ��� �������� �������
    labels: [
      '��', '��', '��', '��',
    ],

    // ������� �� x � y �� ����� �����
    padding: 50,

    // ��� �������
    type: Chart.LINE_TYPE,

    // ����� ����� ��� ��������
    style: {
        // ����� ��� �����
        points: {
            size: 3,
        },
        // ����� ��� �����
        lines: {
            size: 3,
            bezier: true,
        },
    },
};
```


**�������������� �����**
```js
points: {
    size: 3,          // ������ ����� �� �������
    fill: '#222',     // ���� �����
    stroke: '#fff',   // ���� ������� �����
    strokeWidth: 3,   // ������ ������� �����
},
lines: {
    size: 3,          // ������� ����� �� �������
    fill: '#222',     // ���� �����
    bezier: true,     // ����������� ����� �� �����
}
```