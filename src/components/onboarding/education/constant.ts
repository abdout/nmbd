import { Item } from "@/components/onboarding/information/select-popover";

// Educational institutions
export const institutions: Item[] = [
  { label: 'جامعة الخرطوم', value: 'khartoum_university' },
  { label: 'جامعة القاهرة', value: 'cairo_university' },
  { label: 'جامعة العلوم والتكنولوجيا', value: 'science_tech_university' },
];

// Faculties
export const faculties: Item[] = [
  { label: 'كلية علوم الحاسوب', value: 'computer_science' },
  { label: 'كلية الهندسة', value: 'engineering' },
  { label: 'كلية العلوم', value: 'science' },
  { label: 'كلية تقنية المعلومات', value: 'information_technology' }
];

// Diploma majors
export const diplomaMajors: Item[] = [
  { label: 'علوم الحاسوب', value: 'computer_science' },
  { label: 'هندسة البرمجيات', value: 'software_engineering' },
  { label: 'نظم المعلومات', value: 'information_systems' },
  { label: 'تقنية المعلومات', value: 'information_technology' },
];

// Bachelor majors
export const bachelorMajors: Item[] = [
  { label: 'علوم الحاسوب', value: 'computer_science' },
  { label: 'هندسة البرمجيات', value: 'software_engineering' },
  { label: 'نظم المعلومات', value: 'information_systems' },
  { label: 'تقنية المعلومات', value: 'information_technology' },
];

// Master majors
export const masterMajors: Item[] = [
  { label: 'علوم الحاسوب', value: 'computer_science' },
  { label: 'هندسة البرمجيات', value: 'software_engineering' },
  { label: 'نظم المعلومات', value: 'information_systems' },
  { label: 'تقنية المعلومات', value: 'information_technology' },
  { label: 'الذكاء الاصطناعي', value: 'artificial_intelligence' },
  { label: 'أمن المعلومات', value: 'information_security' },
];

// PhD majors
export const phdMajors: Item[] = [
  { label: 'علوم الحاسوب', value: 'computer_science' },
  { label: 'هندسة البرمجيات', value: 'software_engineering' },
  { label: 'الذكاء الاصطناعي', value: 'artificial_intelligence' },
  { label: 'أمن المعلومات', value: 'information_security' },
  { label: 'علم البيانات', value: 'data_science' },
  { label: 'نظم الحوسبة', value: 'computing_systems' }
];

// Professor majors
export const professorMajors: Item[] = [
  { label: 'علوم الحاسوب', value: 'computer_science' },
  { label: 'هندسة البرمجيات', value: 'software_engineering' },
  { label: 'الذكاء الاصطناعي', value: 'artificial_intelligence' },
  { label: 'علم البيانات', value: 'data_science' },
  { label: 'نظم الحوسبة المتقدمة', value: 'advanced_computing_systems' },
  { label: 'نظرية الحوسبة', value: 'computing_theory' }
];

// Student years
export const studentYears: Item[] = [
  { value: '1', label: 'الاولي' },
  { value: '2', label: 'الثانية' },
  { value: '3', label: 'الثالثة' },
  { value: '4', label: 'الرابعة' },
  { value: '5', label: 'الخامسة' },
  { value: '6', label: 'السادسة' },
];

// Education fields
export const EDUCATION_FIELDS = [
  { name: 'educationLevel', label: 'Education Level', type: 'text' },
  { name: 'studentYear', label: 'Student Year', type: 'number' },
  { name: 'studentInstitution', label: 'Student Institution', type: 'text' },
  { name: 'studentFaculty', label: 'Student Faculty', type: 'text' },
  { name: 'studentGraduationYear', label: 'Expected Graduation Year', type: 'number' },
  { name: 'diplomaInstitution', label: 'Diploma Institution', type: 'text' },
  { name: 'diplomaMajor', label: 'Diploma Major', type: 'text' },
  { name: 'diplomaCompletionYear', label: 'Diploma Completion Year', type: 'number' },
  { name: 'bachelorInstitution', label: 'Bachelor Institution', type: 'text' },
  { name: 'bachelorMajor', label: 'Bachelor Major', type: 'text' },
  { name: 'bachelorCompletionYear', label: 'Bachelor Completion Year', type: 'number' },
  { name: 'masterInstitution', label: 'Master Institution', type: 'text' },
  { name: 'masterMajor', label: 'Master Major', type: 'text' },
  { name: 'masterCompletionYear', label: 'Master Completion Year', type: 'number' },
  { name: 'phdInstitution', label: 'PhD Institution', type: 'text' },
  { name: 'phdMajor', label: 'PhD Major', type: 'text' },
  { name: 'phdCompletionYear', label: 'PhD Completion Year', type: 'number' },
  { name: 'professorInstitution', label: 'Professor Institution', type: 'text' },
  { name: 'professorMajor', label: 'Professor Major', type: 'text' },
  { name: 'professorCompletionYear', label: 'Professor Completion Year', type: 'number' },
];

// Occupations by degree level
export const diplomaOccupations: Item[] = [
  { label: 'مبرمج', value: 'programmer' },
  { label: 'مهندس', value: 'engineer' },
];

export const bachelorOccupations: Item[] = [
  { label: 'مبرمج', value: 'programmer' },
  { label: 'مهندس', value: 'engineer' },
];

export const masterOccupations: Item[] = [
  { label: 'مدير تقني', value: 'tech_manager' },
  { label: 'مهندس أول', value: 'senior_engineer' },
];

export const phdOccupations: Item[] = [
  { label: 'أستاذ مساعد', value: 'assistant_professor' },
  { label: 'باحث', value: 'researcher' },
];

export const professorOccupations: Item[] = [
  { label: 'أستاذ جامعي', value: 'university_professor' },
  { label: 'عميد كلية', value: 'dean' },
];

// Academic ranks
export const academicRanks: Item[] = [
  { label: 'أستاذ', value: 'professor' },
  { label: 'أستاذ مشارك', value: 'associate_professor' },
  { label: 'أستاذ مساعد', value: 'assistant_professor' },
];

// Helper function to generate completion years (past years)
export const generateCompletionYears = (): Item[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 50 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });
};

// Helper function to generate future years (for expected graduation)
export const generateFutureYears = (): Item[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: 10 }, (_, i) => {
    const year = currentYear + i;
    return { value: year.toString(), label: year.toString() };
  });
};
