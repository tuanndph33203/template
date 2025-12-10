import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule, CommonModule, ButtonModule, Tooltip],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  isSidebarCollapsed = false;
  menuItems: any[] = [
    {
      icon: 'pi pi-shop',
      label: 'Bán hàng',
      isOpen: false,
      link: '/dashboard',
    },
    {
      icon: 'pi pi-receipt',
      label: 'Hóa đơn',
      isOpen: false,
      link: '/dashboard/invoice',
    },
    {
      icon: 'pi pi-wrench',
      label: 'Hệ thống',
      isOpen: true,
      children: [
        {
          icon: 'pi pi-objects-column',
          label: 'Sản Phẩm',
          link: '/dashboard/product'
        },
        // {
        //   icon: 'pi pi-user',
        //   label: 'Nhân Viên',
        //   link: '/dashboard/employee',
        // },
        {
          icon: 'pi pi-shop',
          label: 'Chi nhánh',
          link: '/dashboard/branch',
        },
      ],
    },

  ];
  router = inject(Router);
  onSidebarToggle() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  toggleMenuItem(item: any) {
    if (!this.isSidebarCollapsed && item.children) {
      item.isOpen = !item.isOpen;
    }
  }
  onMenuClick(item: any) {
    if (item.children) {
      if (this.isSidebarCollapsed) {
        this.onSidebarToggle();
      }
      item.isOpen = !item.isOpen;
    } else if (item.link) {
      this.router.navigate([item.link]);
    }
  }
}
