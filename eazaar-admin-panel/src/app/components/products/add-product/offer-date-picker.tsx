import React from "react";
import Datepicker from "react-tailwindcss-datepicker";

type IPropType = {
  offerDate: {
    startDate: string | null;
    endDate: string | null;
  };
  setOfferDate: React.Dispatch<
    React.SetStateAction<{
      startDate: string | null;
      endDate: string | null;
    }>
  >;
  defaultValue?: {
    startDate: string | null;
    endDate: string | null;
  };
  isRange?: boolean;
};

const OfferDatePicker = ({
  offerDate,
  setOfferDate,
  defaultValue,
  isRange = true,
}: IPropType) => {
  const handleValueChange = (newValue: any) => {
    console.log('Date picker value changed:', newValue);
    setOfferDate(newValue);
  };

  React.useEffect(() => {
    if (defaultValue && defaultValue.startDate && defaultValue.endDate) {
      setOfferDate(defaultValue);
    }
  }, [defaultValue, setOfferDate]);

  return (
    <Datepicker
      useRange={isRange ? true : false}
      inputClassName="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
      value={offerDate}
      onChange={handleValueChange}
      placeholder="Select date range"
    />
  );
};

export default OfferDatePicker;
