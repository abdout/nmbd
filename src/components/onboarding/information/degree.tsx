'use client';
import { useEffect } from "react";
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
  educationLevel,
}: DegreeProps) => {

  // Handle degree completion
  const handleDegreeCompletion = (degreeType: string) => {
    // This function is kept as a placeholder for future non-scroll related completion logic
    console.log('Degree completion triggered for:', degreeType);
  };

  // Render educational components based on selected level
  const renderEducationComponents = () => {
    switch (educationLevel) {
      case 'professor':
        return (
          <div className="space-y-6">
            <div id="section-professor">
              <Professor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('professor')}
              />
            </div>
            <div className="space-y-4" id="section-phd">
              <PhD 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('phd')}
              />
            </div>
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue} 
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'phd':
        return (
          <div className="space-y-6">
            <div className="space-y-4" id="section-phd">
              <p className="text-sm font-semibold mb-2">بيانات الدكتوراه:</p>
              <PhD 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('phd')}
              />
            </div>
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'master':
        return (
          <div className="space-y-6">
            <div id="section-master">
              <Master 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('master')}
              />
            </div>
            <div id="section-bachelor">
              <Bachelor 
                register={register} 
                errors={errors} 
                setValue={setValue}
                onComplete={() => handleDegreeCompletion('bachelor')}
              />
            </div>
          </div>
        );
      case 'bachelor':
        return (
          <div id="section-bachelor">
            <Bachelor 
              register={register} 
              errors={errors} 
              setValue={setValue}
              onComplete={() => handleDegreeCompletion('bachelor')}
            />
          </div>
        );
      case 'diploma':
        return (
          <div id="section-diploma">
            <Diploma 
              register={register} 
              errors={errors} 
              setValue={setValue}
              onComplete={() => handleDegreeCompletion('diploma')}
            />
          </div>
        );
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
        <div id="section-occupation">
          <Occupation 
            register={register} 
            errors={errors} 
            educationLevel={educationLevel} 
          />
        </div>
      )}
    </div>
  );
};

export default Degree; 