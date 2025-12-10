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
        label: 'Tên chi nhánh',
        field: 'Notes',
        type: 'text',
        minWidth: '220px',
        maxWidth: '280px',
        tooltip: true,
        tooltipField: 'Notes',
        lineClamp: 1,
    },

    {
        label: 'Mã chi nhánh',
        field: 'Code',
        type: 'text',
        align: 'center',
        minWidth: '100px',
    },

    {
        label: 'Mã số thuế',
        field: 'TaxCode',
        type: 'text',
        align: 'center',
        minWidth: '160px',
    },

    {
        label: 'Số điện thoại',
        field: 'PhoneNumber',
        type: 'text',
        align: 'center',
        minWidth: '140px',
    },

    {
        label: 'Email',
        field: 'Email',
        type: 'text',
        minWidth: '220px',
        maxWidth: '280px',
        tooltip: true,
        tooltipField: 'Email',
        lineClamp: 1,
    },

    {
        label: 'Địa chỉ',
        field: 'Address',
        type: 'text',
        minWidth: '260px',
        maxWidth: '320px',
        tooltip: true,
        tooltipField: 'Address',
        lineClamp: 1,
    },

    {
        label: 'Trạng thái',
        field: 'Status',
        type: 'transform',
        align: 'center',
        minWidth: '120px',
        transformFn: (v) => v === 1 ? 'Hoạt động' : 'Ngưng hoạt động',
    },

    {
        label: 'Cố định phát hành',
        field: 'IsFixPublish',
        type: 'transform',
        align: 'center',
        minWidth: '140px',
        transformFn: (v) => v ? 'Có' : 'Không',
    },

    // {
    //     label: 'Thao tác',
    //     field: 'action',
    //     type: 'action',
    //     minWidth: '120px',
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
