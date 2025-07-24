import { ImageURL } from "@/hooks/useProductSubmit";
import React, { useState } from "react";

const Sizes = ({
  field,
  handleSizeChange,
  index,
}: {
  handleSizeChange: (sizes: string[], index: number) => void;
  index: number;
  field: ImageURL;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!field.sizes.includes(inputValue.trim())) {
        handleSizeChange([...field.sizes, inputValue.trim()], index);
      }
      setInputValue("");
    }
  };

  const removeSize = (sizeToRemove: string) => {
    handleSizeChange(field.sizes.filter(size => size !== sizeToRemove), index);
  };

  return (
    <div className="mb-5">
      <p className="mb-0 text-base text-black dark:text-white">Sizes</p>
      
      {/* Sizes Heading */}
      {field.sizes.length > 0 && (
        <p className="mb-2 text-sm text-gray-600 dark:text-slate-400 font-medium">Added Sizes</p>
      )}
      
      {/* Sizes Display Area */}
      <div className="tags-input-wrapper mb-2">
        {field.sizes.map((size, i) => (
          <span key={i} className="tag bg-gray-100 dark:bg-slate-600 text-gray-800 dark:text-white">
            {size}
            <b onClick={() => removeSize(size)} className="cursor-pointer ml-2">X</b>
          </span>
        ))}
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="enter sizes"
        className="w-full h-11 px-6 border border-gray dark:border-slate-600 rounded-md bg-white text-black focus:border-theme focus:outline-none"
      />
      <span className="text-tiny leading-4 text-gray-600 dark:text-slate-400">
        press enter to add new size
      </span>
    </div>
  );
};

export default Sizes;