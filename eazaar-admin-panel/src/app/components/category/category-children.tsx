import React, { useEffect, useState } from "react";
import ErrorMsg from "../common/error-msg";

type IPropType = {
  categoryChildren: string[];
  setCategoryChildren: React.Dispatch<React.SetStateAction<string[]>>;
  default_value?: string[];
  error?: string;
};
const CategoryChildren = ({
  categoryChildren,
  setCategoryChildren,
  default_value,
  error,
}: IPropType) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (default_value) {
      setCategoryChildren(default_value);
    }
  }, [default_value, setCategoryChildren]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!categoryChildren.includes(inputValue.trim())) {
        setCategoryChildren([...categoryChildren, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeChild = (childToRemove: string) => {
    setCategoryChildren(categoryChildren.filter(child => child !== childToRemove));
  };

  return (
    <div className="mb-6">
      <p className="mb-0 text-base text-black dark:text-white">Children</p>
      
      {/* Children Heading */}
      {categoryChildren.length > 0 && (
        <p className="mb-2 text-sm text-gray-600 dark:text-slate-400 font-medium">Added Children</p>
      )}
      
      {/* Children Display Area */}
      <div className="tags-input-wrapper mb-2">
        {categoryChildren.map((child, i) => (
          <span key={i} className="tag bg-gray-100 dark:bg-slate-600 text-gray-800 dark:text-white">
            {child}
            <b onClick={() => removeChild(child)} className="cursor-pointer ml-2">X</b>
          </span>
        ))}
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="enter children"
        className="w-full h-11 px-6 border border-gray dark:border-slate-600 rounded-md bg-white text-black focus:border-theme focus:outline-none"
      />
      <em className="text-gray-600 dark:text-slate-400">press enter to add new children</em>
      {error && <ErrorMsg msg={error} />}
    </div>
  );
};

export default CategoryChildren;
