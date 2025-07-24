"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAdjustInventoryMutation } from "@/redux/product/productApi";
import { notifyError, notifySuccess } from "@/utils/toast";

interface InventoryAdjustmentProps {
  productId: string;
  currentQuantity: number;
  onClose: () => void;
}

const InventoryAdjustment: React.FC<InventoryAdjustmentProps> = ({
  productId,
  currentQuantity,
  onClose,
}) => {
  const [quantity, setQuantity] = useState<number>(0);
  const [operation, setOperation] = useState<'add' | 'set'>('add');
  const [adjustInventory, { isLoading }] = useAdjustInventoryMutation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (quantity <= 0) {
      notifyError("Quantity must be greater than 0");
      return;
    }

    try {
      const result = await adjustInventory({
        id: productId,
        quantity,
        operation,
      });

      if ("error" in result) {
        notifyError("Failed to adjust inventory");
      } else {
        notifySuccess(
          operation === 'add' 
            ? `Added ${quantity} units to inventory` 
            : `Set inventory to ${quantity} units`
        );
        onClose();
      }
    } catch (error) {
      notifyError("An error occurred while adjusting inventory");
    }
  };

  const newQuantity = operation === 'add' ? currentQuantity + quantity : quantity;

  if (!mounted) return null;

  const modalContent = (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      style={{ zIndex: 999999 }}
    >
      <div 
        className="bg-white rounded-lg p-6 w-96 shadow-2xl"
        style={{ zIndex: 1000000 }}
      >
        <h3 className="text-lg font-semibold mb-4">Adjust Inventory</h3>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">Current Quantity: {currentQuantity}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Operation
            </label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as 'add' | 'set')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="add">Add to current quantity (Restock)</option>
              <option value="set">Set absolute quantity</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter quantity"
              required
            />
          </div>

          {quantity > 0 && (
            <div className="mb-4 p-3 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-700">
                New quantity will be: <strong>{newQuantity}</strong>
              </p>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || quantity <= 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Adjusting..." : "Adjust Inventory"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};

export default InventoryAdjustment;