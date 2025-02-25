"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface FloatingLabelInputProps {
  id: string;
  label: string;
  name: string;
  register: any;
  error?: any;
  type?: string;
}

export const FloatingLabelInput = ({ 
  id, 
  label, 
  name, 
  register, 
  error, 
  type = "text" 
}: FloatingLabelInputProps) => {
  return (
    <div className="relative">
      <Input
        id={id}
        type={type}
        placeholder=""
        className={cn(
          "peer block w-full",
          error && "border-red-500 focus:border-red-500"
        )}
        {...register(name)}
      />
      <Label 
        htmlFor={id} 
        className={cn(
          "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
          "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary",
          error && "text-red-500 peer-focus:text-red-500"
        )}
      >
        {label}
      </Label>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </div>
  );
};

export interface FloatingLabelTextareaProps {
  id: string;
  label: string;
  name: string;
  register: any;
  error?: any;
}

export const FloatingLabelTextarea = ({ 
  id, 
  label, 
  name, 
  register, 
  error 
}: FloatingLabelTextareaProps) => {
  return (
    <div className="relative">
      <Textarea
        id={id}
        placeholder=""
        className={cn(
          "peer block w-full resize-none min-h-[100px]",
          error && "border-red-500 focus:border-red-500"
        )}
        {...register(name)}
      />
      <Label 
        htmlFor={id} 
        className={cn(
          "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-gray-500 duration-300",
          "peer-placeholder-shown:top-6 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
          "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-primary",
          error && "text-red-500 peer-focus:text-red-500"
        )}
      >
        {label}
      </Label>
      {error && (
        <span className="text-red-500 text-xs mt-1">{error.message}</span>
      )}
    </div>
  );
}; 