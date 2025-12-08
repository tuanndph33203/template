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
      icon: 'pi pi-receipt',
      label: 'Hóa đơn',
      isOpen: false,
      link: '/dashboard',
    },
    {
      icon: 'pi pi-objects-column',
      label: 'Sản Phẩm',
      isOpen: false,
      children: [
        { label: 'Danh sách', link: '/dashboard/product' },
        { label: 'Thêm mới', link: '/dashboard/product/add' },
      ],
    },
    {
      icon: 'pi pi-user',
      label: 'Nhân Viên',
      link: '/dashboard/employee',
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
