import { useState } from 'react';

type FormData = {
  [key: string]: string;
};

const useCustomForm = <T extends FormData>(initialState: T) => {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  return {
    formData,
    handleChange,
    setFormData,
  };
};

export default useCustomForm;
