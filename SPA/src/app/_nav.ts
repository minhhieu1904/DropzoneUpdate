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

  navItemUser: any;
  navItemArticleCategory: any;
  navItemArticle: any;
  navItemProductCategory: any;
  navItemProduct: any;
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
    if (roles.includes(Roles.sets_UserList)) {
      this.navItemUser = {
        name: '1. Settings',
        icon: 'icon-user-following',
        url: '/settings/user-list',
        //children: []
      };
    }


    // if (roles.includes(Roles.sets_UserList)) {
    //   const navItem = {
    //     name: '1.1 User List',
    //     url: '/settings/user-list',
    //     class: 'menu-margin'
    //   };
    //   navItemUser.children.push(navItem);
    // }

    // Article Category
    if (roles.includes(Roles.sets_ArticleCategory)) {
      this.navItemArticleCategory = {
        name: '2. Article Category',
        url: 'article-cate/list',
        icon: 'icon-docs',
        //children: []
      }
    }

    // if (roles.includes(Roles.sets_ArticleCategory)) {
    //   const navItem = {
    //     name: '2.1 Article Category List',
    //     url: '/article-cate/list',
    //     class: 'menu-margin'
    //   };
    //   navItemArticleCategory.children.push(navItem);
    // }

    // Article
    if (roles.includes(Roles.sets_Article)) {
      this.navItemArticle = {
        name: '3. Article',
        url: 'article/list',
        icon: 'icon-doc',
        //children: []
      }
    }

    // if (roles.includes(Roles.sets_Article)) {
    //   const navItem = {
    //     name: '3.1 Article List',
    //     url: '/article',
    //     class: 'menu-margin'
    //   };
    //   navItemArticle.children.push(navItem);
    // }

    // Product Category
    if (roles.includes(Roles.sets_ProductCategory)) {
      this.navItemProductCategory = {
        name: '4. Product Category',
        url: 'product-cate/list',
        icon: 'icon-basket',
        //children: []
      }
    }

    // if (roles.includes(Roles.sets_ProductCategory)) {
    //   const navItem = {
    //     name: '4.1 Product Category List',
    //     url: '/product-cate/list',
    //     class: 'menu-margin'
    //   };
    //   navItemProductCategory.children.push(navItem);
    // }

    // Product
    if (roles.includes(Roles.sets_Product)) {
      this.navItemProduct = {
        name: '5. Product',
        url: 'product/list',
        icon: 'icon-basket-loaded',
        //children: []
      }
    }

    // if (roles.includes(Roles.sets_Product)) {
    //   const navItem = {
    //     name: '5.1 Product List',
    //     url: '/product',
    //     class: 'menu-margin'
    //   };
    //   navItemProduct.children.push(navItem);
    // }

    const navItemPage404 = {
      name: '6. Page 404',
      url: '404',
      icon: 'icon-shield'
    }

    const navItemPage404_2 = {
      name: '7. Page 404 2',
      url: '404-2',
      icon: 'icon-shield'
    }

    const navItemCard = {
      name: '8. Cards',
      url: 'cards',
      icon: 'icon-picture'
    }

    const navItemCalculator = {
      name: '9. Calculator',
      url: 'calculator',
      icon: 'icon-list',
      children: [
        {
          name: '9.1 Version 1',
          url: 'calculator/version1',
          icon: 'icon-calculator'
        }
      ]
    }

    const navItemChart = {
      name: '10. Chart',
      url: 'chart',
      icon: 'icon-list',
      children: [
        {
          name: '10.1 Apexcharts',
          url: 'chart/apexcharts',
          icon: 'icon-calculator'
        },
        {
          name: '10.1 Ng2 Chart',
          url: 'chart/ng2Chart',
          icon: 'icon-calculator'
        }
      ]
    }

    this.navItems.push(navItemDashboard);
    this.navItems.push(this.navItemUser);
    this.navItems.push(this.navItemArticleCategory);
    this.navItems.push(this.navItemArticle);
    this.navItems.push(this.navItemProductCategory);
    this.navItems.push(this.navItemProduct);
    this.navItems.push(navItemPage404);
    this.navItems.push(navItemPage404_2);
    this.navItems.push(navItemCard);
    this.navItems.push(navItemCalculator);
    this.navItems.push(navItemChart);

    return this.navItems;
  }
}
