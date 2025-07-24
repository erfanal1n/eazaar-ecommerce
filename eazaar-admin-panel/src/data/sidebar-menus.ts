import { ISidebarMenus } from "./../types/menu-types";
import {
  Dashboard,
  Categories,
  Coupons,
  Orders,
  Pages,
  Products,
  Profile,
  Reviews,
  Setting,
  Leaf,
  StuffUser,
  ProductType,
  Users,
  Analytics,
  Palette,
} from "@/svg";

const sidebar_menu: Array<ISidebarMenus> = [
  {
    id: 1,
    icon: Dashboard,
    link: "/dashboard",
    title: "Dashboard",
  },
  {
    id: 2,
    icon: Analytics,
    link: "/analytics",
    title: "Analytics",
    subMenus: [
      { title: "Business Overview", link: "/analytics/business-overview" },
      { title: "Sales & Products", link: "/analytics/sales-products" },
      { title: "Customer Insights", link: "/analytics/customer-insights" },
      { title: "Reports & Exports", link: "/analytics/reports-exports" }
    ],
  },
  {
    id: 3,
    icon: Products,
    link: "/product-list",
    title: "Products",
    subMenus: [
      { title: "Product List", link: "/product-list" },
      { title: "Product Grid", link: "/product-grid" },
      { title: "Add Product", link: "/add-product" }
    ],
  },
  {
    id: 4,
    icon: Categories,
    link: "/category",
    title: "Category",
  },
  {
    id: 5,
    icon: ProductType,
    link: "/product-type",
    title: "Product Type",
  },
  {
    id: 6,
    icon: Orders,
    link: "/orders",
    title: "Orders",
    subMenus: [
      { title: "Order List", link: "/orders" },
      { title: "Invoice Settings", link: "/invoice-settings" }
    ],
  },
  {
    id: 7,
    icon: Leaf,
    link: "/brands",
    title: "Brand",
  },
  {
    id: 8,
    icon: Reviews,
    link: "/reviews",
    title: "Reviews",
  },
  {
    id: 9,
    icon: Coupons,
    link: "/coupon",
    title: "Coupons",
  },
  {
    id: 10,
    icon: Profile,
    link: "/profile",
    title: "Profile",
  },
  {
    id: 11,
    icon: Setting,
    link: "#",
    title: "Online store",
  },
  {
    id: 12,
    icon: StuffUser,
    link: "/our-staff",
    title: "Our Staff",
  },
  {
    id: 16,
    icon: StuffUser,
    link: "#",
    title: "Admin Management",
    subMenus: [
      { title: "Admin Roles", link: "/admin-roles" },
      { title: "Admin Users", link: "/admin-users" }
    ],
  },
  {
    id: 13,
    icon: Users,
    link: "/registered-users",
    title: "Registered Users",
  },
];

export default sidebar_menu;
