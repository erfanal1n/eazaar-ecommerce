const mongoose = require("mongoose");

const adminRoleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
    },
    permissions: [{
      page: {
        type: String,
        required: true,
      },
      canView: {
        type: Boolean,
        default: false,
      },
      canCreate: {
        type: Boolean,
        default: false,
      },
      canEdit: {
        type: Boolean,
        default: false,
      },
      canDelete: {
        type: Boolean,
        default: false,
      }
    }],
    isActive: {
      type: Boolean,
      default: true,
    },
    isSystemRole: {
      type: Boolean,
      default: false, // System roles cannot be deleted
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    }
  },
  {
    timestamps: true,
  }
);

const AdminRole = mongoose.model("AdminRole", adminRoleSchema);

module.exports = AdminRole;