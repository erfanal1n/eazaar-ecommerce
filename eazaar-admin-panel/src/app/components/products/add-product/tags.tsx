import React, { useEffect, useState } from "react";

type IPropType = {
  tags: string[];
  setTags: React.Dispatch<React.SetStateAction<string[]>>;
  default_value?: string[];
};

const Tags = ({ tags, setTags, default_value }: IPropType) => {
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    if (default_value) {
      setTags(default_value);
    }
  }, [default_value, setTags]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()]);
      }
      setInputValue("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="mb-5 tp-product-tags">
      {/* Tags Heading */}
      {tags.length > 0 && (
        <p className="mb-2 text-base text-black dark:text-white font-medium">Tags</p>
      )}
      
      {/* Tags Display Area - Similar to Product Category */}
      <div className="tags-input-wrapper mb-2">
        {tags.map((tag, i) => (
          <span key={i} className="tag bg-gray-100 dark:bg-slate-600 text-gray-800 dark:text-white">
            {tag}
            <b onClick={() => removeTag(tag)} className="cursor-pointer ml-2">X</b>
          </span>
        ))}
      </div>
      
      {/* Input Field */}
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="enter tags"
        className="w-full h-11 px-6 border border-gray dark:border-slate-600 rounded-md bg-white text-black focus:border-theme focus:outline-none"
      />
      <em className="text-gray-600 dark:text-slate-400">press enter to add new tag</em>
    </div>
  );
};

export default Tags;