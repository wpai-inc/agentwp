import * as Form from '@radix-ui/react-form';
import { ReactNode, useState } from 'react';

type TextareaProps = {
  name: string;
  value: string;
  label: string;
  placeholder: string;
  required: boolean;
  validateMessage?: {
    missing?: string;
    custom?: string;
  };
  onChange?: (value: string) => void;
  labelInstructions?: ReactNode;
};

export default function Textarea({
  name,
  value,
  label,
  placeholder,
  required,
  validateMessage,
  onChange,
  labelInstructions,
}: TextareaProps) {
  const [currentValue, setCurrentValue] = useState(value);

  console.log(validateMessage);

  function handleOnChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setCurrentValue(e.target.value);
    onChange && onChange(e.target.value);
  }

  return (
    <Form.Field className="mt-4" name="textarea">
      <div className="flex items-baseline justify-between">
        <Form.Label className="font-medium leading-[35px]">{label}</Form.Label>
        {labelInstructions}
      </div>
      <Form.Control asChild>
        <textarea
          className="w-full h-[120px] bg-white rounded-[5px] border p-2"
          required={required}
          placeholder={placeholder}
          value={currentValue}
          name={name}
          onChange={(e) => handleOnChange(e)}
        />
      </Form.Control>
      <Form.Message className="text-sm text-red-600" match="valueMissing">
        {validateMessage?.missing
          ? validateMessage.missing
          : 'This field is required'}
      </Form.Message>
      {validateMessage?.custom && (
        <Form.Message className="text-sm text-red-600">
          {validateMessage.custom}
        </Form.Message>
      )}
    </Form.Field>
  );
}
