'use client';
import { useState, useEffect } from "react";
import { UseFormRegister, FieldErrors, UseFormSetValue } from "react-hook-form";
import { InformationSchema } from "./validation";
import SelectPopover, { Item } from "./select-popover";
import { institutions, faculties, studentYears } from "./constants";

interface StudentProps {
  register: UseFormRegister<InformationSchema>;
  errors: FieldErrors<InformationSchema>;
  setValue: UseFormSetValue<InformationSchema>;
}

const Student = ({
  register,
  errors,
  setValue
}: StudentProps) => {
  const [selectedStudentInstitution, setSelectedStudentInstitution] = useState<Item | null>(null);
  const [selectedStudentFaculty, setSelectedStudentFaculty] = useState<Item | null>(null);
  const [selectedStudentYear, setSelectedStudentYear] = useState<Item | null>(null);

  // Track field completion
  const [institutionCompleted, setInstitutionCompleted] = useState(false);
  const [facultyCompleted, setFacultyCompleted] = useState(false);
  const [yearCompleted, setYearCompleted] = useState(false);
  
  // Check if all fields are completed
  useEffect(() => {
    if (institutionCompleted && facultyCompleted && yearCompleted) {
      // Dispatch event when all Student fields are completed
      const event = new CustomEvent('educationFieldCompleted', {
        detail: {
          componentType: 'student',
          fieldType: 'all'
        }
      });
      document.dispatchEvent(event);
    }
  }, [institutionCompleted, facultyCompleted, yearCompleted]);

  // Handle student institution selection
  const handleStudentInstitutionSelect = (item: Item | null) => {
    if (item) {
      setValue('studentInstitution', item.label);
      setSelectedStudentInstitution(item);
      setInstitutionCompleted(true);
    } else {
      setValue('studentInstitution', '');
      setSelectedStudentInstitution(null);
      setInstitutionCompleted(false);
    }
  };

  // Handle student faculty selection
  const handleStudentFacultySelect = (item: Item | null) => {
    if (item) {
      setValue('studentFaculty', item.label);
      setSelectedStudentFaculty(item);
      setFacultyCompleted(true);
    } else {
      setValue('studentFaculty', '');
      setSelectedStudentFaculty(null);
      setFacultyCompleted(false);
    }
  };

  // Handle student year selection
  const handleStudentYearSelect = (item: Item | null) => {
    if (item) {
      setValue('studentYear', item.value);
      setSelectedStudentYear(item);
      setYearCompleted(true);
    } else {
      setValue('studentYear', '');
      setSelectedStudentYear(null);
      setYearCompleted(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm font-semibold mb-2">بيانات الدراسة:</p>
      <div className="grid grid-cols-3 gap-3">
        {/* Student Institution */}
        <div className="relative">
          <input type="hidden" {...register('studentInstitution')} value={selectedStudentInstitution?.label || ''} />
          <SelectPopover
            items={institutions}
            selectedItem={selectedStudentInstitution}
            setSelectedItem={handleStudentInstitutionSelect}
            label="الجامعة"
          />
          {errors.studentInstitution && (
            <span className="text-red-500 text-sm">{errors.studentInstitution.message}</span>
          )}
        </div>

        {/* Student Faculty */}
        <div className="relative">
          <input type="hidden" {...register('studentFaculty')} value={selectedStudentFaculty?.label || ''} />
          <SelectPopover
            items={faculties}
            selectedItem={selectedStudentFaculty}
            setSelectedItem={handleStudentFacultySelect}
            label="التخصص"
          />
          {errors.studentFaculty && (
            <span className="text-red-500 text-sm">{errors.studentFaculty.message}</span>
          )}
        </div>

        {/* Student Year */}
        <div className="relative">
          <input type="hidden" {...register('studentYear')} value={selectedStudentYear?.value || ''} />
          <SelectPopover
            items={studentYears}
            selectedItem={selectedStudentYear}
            setSelectedItem={handleStudentYearSelect}
            label="السنة"
          />
          {errors.studentYear && (
            <span className="text-red-500 text-sm">{errors.studentYear.message}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default Student; 