const AdminRole = require("../model/AdminRole");
const Admin = require("../model/Admin");

// Get all available pages dynamically
const getAvailablePages = () => {
  return [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Analytics", path: "/analytics" },
    { name: "Business Overview", path: "/analytics/business-overview" },
    { name: "Sales & Products", path: "/analytics/sales-products" },
    { name: "Customer Insights", path: "/analytics/customer-insights" },
    { name: "Reports & Exports", path: "/analytics/reports-exports" },
    { name: "Products", path: "/product-list" },
    { name: "Product List", path: "/product-list" },
    { name: "Product Grid", path: "/product-grid" },
    { name: "Add Product", path: "/add-product" },
    { name: "Category", path: "/category" },
    { name: "Product Type", path: "/product-type" },
    { name: "Orders", path: "/orders" },
    { name: "Invoice Settings", path: "/invoice-settings" },
    { name: "Brand", path: "/brands" },
    { name: "Reviews", path: "/reviews" },
    { name: "Coupons", path: "/coupon" },
    { name: "Test Hero Banners", path: "/test-hero-banners" },
    { name: "Profile", path: "/profile" },
    { name: "Our Staff", path: "/our-staff" },
    { name: "Admin Roles", path: "/admin-roles" },
    { name: "Admin Users", path: "/admin-users" },
    { name: "Registered Users", path: "/registered-users" },
  ];
};

// Create a new admin role
const createAdminRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await AdminRole.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        status: false,
        message: "Role with this name already exists",
      });
    }

    const newRole = new AdminRole({
      name,
      description,
      permissions,
      createdBy: req.user?._id,
    });

    await newRole.save();

    res.status(201).json({
      status: true,
      message: "Admin role created successfully",
      data: newRole,
    });
  } catch (error) {
    next(error);
  }
};

// Get all admin roles
const getAllAdminRoles = async (req, res, next) => {
  try {
    const roles = await AdminRole.find({ isActive: true })
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: true,
      message: "Admin roles retrieved successfully",
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

// Get admin role by ID
const getAdminRoleById = async (req, res, next) => {
  try {
    const role = await AdminRole.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Admin role not found",
      });
    }

    res.status(200).json({
      status: true,
      message: "Admin role retrieved successfully",
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// Update admin role
const updateAdminRole = async (req, res, next) => {
  try {
    const { name, description, permissions } = req.body;
    const roleId = req.params.id;

    const role = await AdminRole.findById(roleId);
    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Admin role not found",
      });
    }

    // Check if it's a system role
    if (role.isSystemRole) {
      return res.status(403).json({
        status: false,
        message: "System roles cannot be modified",
      });
    }

    // Check if name is being changed and if new name already exists
    if (name !== role.name) {
      const existingRole = await AdminRole.findOne({ name, _id: { $ne: roleId } });
      if (existingRole) {
        return res.status(400).json({
          status: false,
          message: "Role with this name already exists",
        });
      }
    }

    const updatedRole = await AdminRole.findByIdAndUpdate(
      roleId,
      { name, description, permissions },
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    res.status(200).json({
      status: true,
      message: "Admin role updated successfully",
      data: updatedRole,
    });
  } catch (error) {
    next(error);
  }
};

// Delete admin role
const deleteAdminRole = async (req, res, next) => {
  try {
    const roleId = req.params.id;

    const role = await AdminRole.findById(roleId);
    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Admin role not found",
      });
    }

    // Check if it's a system role
    if (role.isSystemRole) {
      return res.status(403).json({
        status: false,
        message: "System roles cannot be deleted",
      });
    }

    // Check if any admin is using this role
    const adminsWithRole = await Admin.find({ role: role.name });
    if (adminsWithRole.length > 0) {
      return res.status(400).json({
        status: false,
        message: "Cannot delete role. Some admins are still assigned to this role.",
      });
    }

    await AdminRole.findByIdAndDelete(roleId);

    res.status(200).json({
      status: true,
      message: "Admin role deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// Get available pages for role creation
const getAvailablePagesForRole = async (req, res, next) => {
  try {
    const pages = getAvailablePages();
    
    res.status(200).json({
      status: true,
      message: "Available pages retrieved successfully",
      data: pages,
    });
  } catch (error) {
    next(error);
  }
};

// Initialize default roles
const initializeDefaultRoles = async () => {
  try {
    const defaultRoles = [
      {
        name: "Super Admin",
        description: "Full access to all features",
        isSystemRole: true,
        permissions: getAvailablePages().map(page => ({
          page: page.path,
          canView: true,
          canCreate: true,
          canEdit: true,
          canDelete: true,
        })),
      },
      {
        name: "Admin",
        description: "Standard admin access",
        isSystemRole: true,
        permissions: getAvailablePages().map(page => ({
          page: page.path,
          canView: true,
          canCreate: page.path !== "/admin-roles" && page.path !== "/admin-users",
          canEdit: page.path !== "/admin-roles" && page.path !== "/admin-users",
          canDelete: false,
        })),
      },
      {
        name: "Manager",
        description: "Management level access",
        isSystemRole: true,
        permissions: getAvailablePages()
          .filter(page => !page.path.includes("/admin"))
          .map(page => ({
            page: page.path,
            canView: true,
            canCreate: true,
            canEdit: true,
            canDelete: false,
          })),
      },
      {
        name: "CEO",
        description: "Executive level access",
        isSystemRole: true,
        permissions: getAvailablePages()
          .filter(page => page.path === "/dashboard" || page.path.includes("/analytics"))
          .map(page => ({
            page: page.path,
            canView: true,
            canCreate: false,
            canEdit: false,
            canDelete: false,
          })),
      },
    ];

    for (const roleData of defaultRoles) {
      const existingRole = await AdminRole.findOne({ name: roleData.name });
      if (!existingRole) {
        await AdminRole.create(roleData);
      }
    }
  } catch (error) {
    console.error("Error initializing default roles:", error);
  }
};

module.exports = {
  createAdminRole,
  getAllAdminRoles,
  getAdminRoleById,
  updateAdminRole,
  deleteAdminRole,
  getAvailablePagesForRole,
  initializeDefaultRoles,
};