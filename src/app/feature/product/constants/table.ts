import { ITableConfig } from "@app/core/models/common";

export const colsTempList = (config: any): ITableConfig[] => [
    {
        label: 'STT',
        field: 'index',
        type: 'index',
        align: 'center',
        minWidth: '60px',
    },

    {
        label: 'Tên dịch vụ',
        field: 'Name',
        type: 'text',
        minWidth: '250px',
        maxWidth: '290px',
        tooltip: true,
        tooltipField: 'Name',
        lineClamp: 1
    },

    {
        label: 'Mã dịch vụ',
        field: 'Code',
        type: 'text',
        align: 'center',
        minWidth: '120px',
    },

    {
        label: 'Đơn vị',
        field: 'UnitName',
        type: 'text',
        align: 'center',
        minWidth: '100px',
    },

    {
        label: 'Thời gian sử dụng',
        field: 'TimeUsed',
        type: 'transform',
        align: 'right',
        minWidth: '150px',
        transformFn: (v) => `${v} phút`,
    },
    {
        label: 'Đơn giá',
        field: 'Price',
        type: 'currency',
        align: 'right',
        minWidth: '150px',
        inputConfig: {
            suffix: ' đ',
        },
    },

    {
        label: 'VAT',
        field: 'VatRate',
        type: 'transform',
        align: 'center',
        minWidth: '100px',
        transformFn: (v) => `${v} %`,
    },

    {
        label: 'Hình ảnh',
        field: 'UrlImage',
        type: 'image',
        align: 'center',
        minWidth: '120px',
    },

    // {
    //     label: 'Thao tác',
    //     field: 'action',
    //     type: 'action',
    //     minWidth: '100px',
    //     actionButtons: [
    //         {
    //             icon: 'pi pi-eye',
    //             tooltipLabel: 'Xem chi tiết',
    //             type: 'view-detail',
    //         },
    //         {
    //             icon: 'pi pi-file-edit',
    //             tooltipLabel: 'Chỉnh sửa',
    //             type: 'edit',
    //             visible: () => config?.role === 'Admin hệ thống',
    //         },
    //     ],
    // },
];
