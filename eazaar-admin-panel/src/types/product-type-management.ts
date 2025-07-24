export interface IProductTypeItem {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  status: 'active' | 'inactive';
  categories?: string[];
  products?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductTypeResponse {
  success: boolean;
  result: IProductTypeItem[];
}

export interface SingleProductTypeResponse {
  success: boolean;
  result: IProductTypeItem;
}

export interface IAddProductType {
  name: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive';
}

export interface IUpdateProductType {
  name?: string;
  description?: string;
  icon?: string;
  status?: 'active' | 'inactive';
}

export interface IAddProductTypeResponse {
  status: string;
  message: string;
  data: {
    name: string;
    description?: string;
    icon?: string;
    slug: string;
    status: 'active' | 'inactive';
    categories?: any[];
    products?: any[];
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IUpdateProductTypeResponse {
  status: string;
  message: string;
  result: {
    name: string;
    description?: string;
    icon?: string;
    slug: string;
    status: 'active' | 'inactive';
    categories?: any[];
    products?: any[];
    _id: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface IProductTypeDeleteRes {
  success?: boolean;
  message?: string;
  result?: any;
}

export interface IToggleProductTypeStatusResponse {
  status: string;
  message: string;
  result: {
    _id: string;
    name: string;
    status: 'active' | 'inactive';
    updatedAt: string;
  };
}

export interface IProductTypeStatsResponse {
  success: boolean;
  result: {
    _id: 'active' | 'inactive';
    count: number;
  }[];
}

// Form related types
export interface ProductTypeFormData {
  name: string;
  description: string;
  icon: string;
  status: 'active' | 'inactive';
}

export interface ProductTypeTableRow {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  status: 'active' | 'inactive';
  categoriesCount?: number;
  productsCount?: number;
  createdAt: string;
  updatedAt: string;
}

// API Query types
export interface ProductTypeApiParams {
  page?: number;
  limit?: number;
  status?: 'active' | 'inactive';
  search?: string;
}

export interface ProductTypeDropdownOption {
  value: string;
  label: string;
  slug: string;
  status: 'active' | 'inactive';
}