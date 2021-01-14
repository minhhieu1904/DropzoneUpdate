import { Injectable } from '@angular/core';
import { INavData } from '@coreui/angular';
import { Roles } from './_core/_constants/roles.constant';

@Injectable({
  providedIn: 'root'
})
export class NavItem {
  navItems: INavData[] = [];
  hasReport: boolean = false;
  hasUser: boolean = false;
  constructor() { }

  getNav() {
    const user: any = JSON.parse(localStorage.getItem('user'));
    const roles: string[] = user.role;
    this.navItems = [];

    // Dashboard
    const navItemDashboard = {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer'
    };
    
    // User
    const navItemUser = {
      name: '1. Settings',
      url: 'settings',
      icon: 'icon-user-following',
      children: []
    };

    if (roles.includes(Roles.sets_UserList)) {
      const navItem = {
        name: '1.1 User List',
        url: '/settings/user-list',
        class: 'menu-margin'
      };
      navItemUser.children.push(navItem);
    }

    // Article Category
    const navItemArticleCategory = {
      name: '2. Article Category',
      url: 'article-cate',
      icon: 'icon-docs',
      children: []
    }

    if (roles.includes(Roles.sets_ArticleCategory)) {
      const navItem = {
        name: '2.1 Article Category List',
        url: '/article-cate/list',
        class: 'menu-margin'
      };
      navItemArticleCategory.children.push(navItem);
    }

    // Article
    const navItemArticle = {
      name: '3. Article',
      url: 'article',
      icon: 'icon-doc',
      children: []
    }

    if (roles.includes(Roles.sets_Article)) {
      const navItem = {
        name: '3.1 Article List',
        url: '/article',
        class: 'menu-margin'
      };
      navItemArticle.children.push(navItem);
    }

    // Product Category
    const navItemProductCategory = {
      name: '4. Product Category',
      url: 'product-cate',
      icon: 'icon-basket',
      children: []
    }

    if (roles.includes(Roles.sets_ProductCategory)) {
      const navItem = {
        name: '4.1 Product Category List',
        url: '/product-cate/list',
        class: 'menu-margin'
      };
      navItemProductCategory.children.push(navItem);
    }

    // Product
    const navItemProduct = {
      name: '5. Product',
      url: 'product',
      icon: 'icon-basket-loaded',
      children: []
    }

    if (roles.includes(Roles.sets_Product)) {
      const navItem = {
        name: '5.1 Product List',
        url: '/product',
        class: 'menu-margin'
      };
      navItemProduct.children.push(navItem);
    }

    this.navItems.push(navItemDashboard);
    this.navItems.push(navItemUser);
    this.navItems.push(navItemArticleCategory);
    this.navItems.push(navItemArticle);
    this.navItems.push(navItemProductCategory);
    this.navItems.push(navItemProduct);

    return this.navItems;
  }
}
