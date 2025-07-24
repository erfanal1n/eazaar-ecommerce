import Link from "next/link";
import Swal from "sweetalert2";
import React, { useState } from "react";
import { Delete, Edit, Inventory } from "@/svg";
import { notifyError } from "@/utils/toast";
import { useDeleteProductMutation } from "@/redux/product/productApi";
import DeleteTooltip from "../tooltip/delete-tooltip";
import EditTooltip from "../tooltip/edit-tooltip";
import InventoryAdjustment from "../products/inventory-adjustment";

const EditDeleteBtn = ({ id, currentQuantity = 0 }: { id: string; currentQuantity?: number }) => {
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [showDelete, setShowDelete] = useState<boolean>(false);
  const [showInventory, setShowInventory] = useState<boolean>(false);
  const [showInventoryModal, setShowInventoryModal] = useState<boolean>(false);
  const [deleteProduct, { data: delData }] = useDeleteProductMutation();

  const handleDelete = async (productId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: `Delete this product ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(productId);
          if ("error" in res) {
            if ("data" in res.error) {
              const errorData = res.error.data as { message?: string };
              if (typeof errorData.message === "string") {
                return notifyError(errorData.message);
              }
            }
          } else {
            Swal.fire("Deleted!", `Your product has been deleted.`, "success");
          }
        } catch (error) {}
      }
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <button
          onClick={() => setShowInventoryModal(true)}
          onMouseEnter={() => setShowInventory(true)}
          onMouseLeave={() => setShowInventory(false)}
          className="w-10 h-10 leading-10 text-tiny bg-blue-500 text-white rounded-md hover:bg-blue-600"
          title="Adjust Inventory"
        >
          <Inventory />
        </button>
        {showInventory && (
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap z-50">
            Adjust Inventory
          </div>
        )}
      </div>
      <div className="relative">
        <Link href={`/edit-product/${id}`}>
          <button
            onMouseEnter={() => setShowEdit(true)}
            onMouseLeave={() => setShowEdit(false)}
            className="w-10 h-10 leading-10 text-tiny bg-success text-white rounded-md hover:bg-green-600"
          >
            <Edit />
          </button>
        </Link>
        <EditTooltip showEdit={showEdit} />
      </div>
      <div className="relative">
        <button
          onClick={() => handleDelete(id)}
          onMouseEnter={() => setShowDelete(true)}
          onMouseLeave={() => setShowDelete(false)}
          className="w-10 h-10 leading-[33px] text-tiny bg-white border border-gray text-slate-600 rounded-md hover:bg-danger hover:border-danger hover:text-white"
        >
          <Delete />
        </button>
        <DeleteTooltip showDelete={showDelete} />
      </div>

      {showInventoryModal && (
        <InventoryAdjustment
          productId={id}
          currentQuantity={currentQuantity}
          onClose={() => setShowInventoryModal(false)}
        />
      )}
    </div>
  );
};

export default EditDeleteBtn;
