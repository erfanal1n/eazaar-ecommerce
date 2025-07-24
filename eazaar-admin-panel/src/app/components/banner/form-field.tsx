import ErrorMsg from "../common/error-msg";

interface FormFieldProps {
  title: string;
  isRequired: boolean;
  bottomTitle?: string;
  type?: string;
  placeHolder: string;
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string | number;
  className?: string;
}

export default function BannerFormField({
  title,
  isRequired,
  bottomTitle,
  type = "text",
  placeHolder,
  value,
  onChange,
  defaultValue,
  className = "",
}: FormFieldProps) {
  return (
    <div className="mb-5">
      {title && (
        <p className="mb-0 text-base text-black dark:text-white capitalize">
          {title} {isRequired && <span className="text-red">*</span>}
        </p>
      )}
      <input
        className={`input w-full h-[44px] rounded-md border border-gray6 px-6 text-base ${className}`}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeHolder}
        defaultValue={defaultValue}
      />
      {bottomTitle && (
        <span className="text-tiny leading-4 text-gray-500 dark:text-gray-400">{bottomTitle}</span>
      )}
    </div>
  );
}