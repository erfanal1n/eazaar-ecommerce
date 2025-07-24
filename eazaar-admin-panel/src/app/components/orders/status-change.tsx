import React from "react";
import ReactSelect from "react-select";
import { notifySuccess } from "@/utils/toast";
import { useUpdateStatusMutation } from "@/redux/order/orderApi";

// option
const options = [
  { value: "delivered", label: "delivered" },
  { value: "processing", label: "Processing" },
  { value: "pending", label: "Pending" },
  { value: "cancel", label: "cancel" },
];

const OrderStatusChange = ({ id }: { id: string }) => {
  const [updateStatus, { data: updateStatusData }] = useUpdateStatusMutation();
  const handleChange = async (value: string | undefined, id: string) => {
    if (value) {
      const res = await updateStatus({ id, status: { status: value } });
      if ("data" in res) {
        if ("message" in res.data) {
          notifySuccess(res.data.message);
        }
      }
    }
  };
  return (
    <div className="force-light-select">
      <style jsx>{`
        .force-light-select .react-select__control {
          background-color: white !important;
          border-color: #e5e7eb !important;
          color: #374151 !important;
        }
        .force-light-select .react-select__single-value {
          color: #374151 !important;
        }
        .force-light-select .react-select__placeholder {
          color: #9ca3af !important;
        }
        .force-light-select .react-select__input-container {
          color: #374151 !important;
        }
        .force-light-select .react-select__value-container {
          background-color: white !important;
        }
      `}</style>
      <ReactSelect
        onChange={(value) => handleChange(value?.value, id)}
        options={options}
        isSearchable={false}
        placeholder="Select Action"
        classNamePrefix="react-select"
        styles={{
          control: (provided) => ({
            ...provided,
            minWidth: '120px',
            width: '100%',
            maxWidth: '150px',
            fontSize: '12px',
            backgroundColor: 'white',
            borderColor: '#e5e7eb',
            color: '#374151',
            minHeight: '32px',
            height: '32px'
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '0 6px'
          }),
          input: (provided) => ({
            ...provided,
            margin: '0',
            padding: '0'
          }),
          indicatorSeparator: () => ({
            display: 'none'
          }),
          indicatorsContainer: (provided) => ({
            ...provided,
            height: '32px'
          }),
          option: (provided) => ({
            ...provided,
            fontSize: '12px',
            padding: '6px 12px'
          }),
          singleValue: (provided) => ({
            ...provided,
            fontSize: '12px'
          }),
          placeholder: (provided) => ({
            ...provided,
            fontSize: '12px'
          }),
          menu: (provided) => ({
            ...provided,
            fontSize: '12px'
          })
        }}
      />
    </div>
  );
};

export default OrderStatusChange;
