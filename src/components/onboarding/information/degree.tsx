'use client';
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import Student from "./student";
import Diploma from "./diploma";
import Bachelor from "./bachelor";
import Master from "./master";
import PhD from "./phd";
import Professor from "./professor";
import Occupation from "./occupation";

interface DegreeProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
  educationLevel: string;
}

const Degree = ({
  register,
  errors,
  setValue,
  educationLevel
}: DegreeProps) => {
  // Render educational components based on selected level
  const renderEducationComponents = () => {
    switch (educationLevel) {
      case 'professor':
        return (
          <div className="space-y-6">
            <Professor register={register} errors={errors} setValue={setValue} />
            <div className="space-y-4">
              <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
              <PhD register={register} errors={errors} setValue={setValue} />
            </div>
            <Master register={register} errors={errors} setValue={setValue} />
            <Bachelor register={register} errors={errors} setValue={setValue} />
          </div>
        );
      case 'phd':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
              <PhD register={register} errors={errors} setValue={setValue} />
            </div>
            <Master register={register} errors={errors} setValue={setValue} />
            <Bachelor register={register} errors={errors} setValue={setValue} />
          </div>
        );
      case 'master':
        return (
          <div className="space-y-6">
            <Master register={register} errors={errors} setValue={setValue} />
            <Bachelor register={register} errors={errors} setValue={setValue} />
          </div>
        );
      case 'bachelor':
        return <Bachelor register={register} errors={errors} setValue={setValue} />;
      case 'diploma':
        return <Diploma register={register} errors={errors} setValue={setValue} />;
      case 'student':
        return <Student register={register} errors={errors} setValue={setValue} />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {renderEducationComponents()}
      {educationLevel !== 'student' && (
        <Occupation 
          register={register} 
          errors={errors} 
          educationLevel={educationLevel} 
        />
      )}
    </div>
  );
};

export default Degree; 