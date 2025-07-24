import { FieldErrors, UseFormRegister } from "react-hook-form";
import ErrorMsg from "../common/error-msg";

export default function FormField({
  title,
  isRequired,
  bottomTitle,
  type = "text",
  placeHolder,
  register,
  errors,
  defaultValue,
}: {
  title: string;
  isRequired: boolean;
  bottomTitle?: string;
  type?: string;
  placeHolder: string;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  defaultValue?:string | number;
}) {
  return (
    <div className="mb-5">
      {title && (
        <p className="mb-0 text-base text-black capitalize">
          {title} {isRequired && <span className="text-red">*</span>}
        </p>
      )}
      <input
        {...register(title.split(" ").join("_"), {
          required: isRequired ? `${title} is required!` : false,
          value: defaultValue,
        })}
        className="input w-full h-[44px] rounded-md border border-gray6 px-6 text-base"
        type={type}
        name={title.split(" ").join("_")}
        id={title.split(" ").join("_")}
        placeholder={placeHolder}
        defaultValue={defaultValue}
        key={defaultValue} // Force re-render when defaultValue changes
        onChange={(e) => {
          console.log(`=== FORM FIELD CHANGE: ${title} ===`);
          console.log("Field name:", title.split(" ").join("_"));
          console.log("New value:", e.target.value);
          console.log("=== FORM FIELD CHANGE END ===");
        }}
      />
      {isRequired && (
        <ErrorMsg msg={(errors?.[title.split(" ").join("_")]?.message as string) || ""} />
      )}
      {bottomTitle && (
        <span className="text-tiny leading-4">{bottomTitle}</span>
      )}
    </div>
  );
}
