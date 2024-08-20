"use client"

import { RegisterOptions, UseFormRegister } from "react-hook-form";

interface InputProps {
  type: string,
  placeholder: string,
  name: string,
  register: UseFormRegister<any>;
  error?: string;
  rules?: RegisterOptions;
  className?: string;
}

export function Input({ name, placeholder, type, register, rules, error, className }: InputProps) {
  return (
    <>
      <input
        className={`${className} bg-slate-200 rounded-lg placeholder:text-slate-400
                     text-sm text-slate-600
                     outline-none focus:border-[3px] focus:border-[#4f46e550]/50`}
        placeholder={placeholder}
        type={type}
        {...register(name, rules)}
        id={name}
      />
      {error && <p className="text-sm text-red-500 my-1">{error}</p>}
    </>
  )
}