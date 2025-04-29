# Migration Plan: Separating Education and Information Components

## 1. Current State Analysis

### 1.1 Schema Structure
- The Prisma schema shows combined education and personal information fields in the User model
- Education-related fields include:
  - educationLevel
  - studentYear
  - Bachelor's information (institution, major, completionYear)
  - Master's information (institution, major, completionYear)
  - PhD information (institution, major, completionYear)
  - Professor information (institution, major, completionYear)
  - Student details (institution, faculty)

### 1.2 Component Structure
- Currently have backup in `@information-backup` directory
- Need to properly separate into:
  - `@education` directory for education-related components
  - `@information` directory for personal information components

## 2. Migration Steps

### 2.1 Education Components Migration
1. Move education-related components to `@education`:
   - `student.tsx`
   - `diploma.tsx`
   - `professor.tsx`
   - `phd.tsx`
   - `master.tsx`
   - `bachelor.tsx`
   - `education.tsx`
   - `education-selector.tsx`
   - `degree.tsx`
   - `degree-selector.tsx`

2. Move education-related constants:
   - Create/Update `@education/constant.ts` with:
     - institutions
     - faculties
     - diplomaMajors
     - bachelorMajors
     - masterMajors
     - phdMajors
     - professorMajors
     - studentYears
     - academicRanks
     - completion year generators

3. Move education-related actions:
   - Create `@education/action.ts` for:
     - Education form submissions
     - Education data updates
     - Education-specific validations

### 2.2 Information Components Migration
1. Move information-related components to `@information`:
   - Personal information forms
   - Contact information forms
   - Location information forms
   - Birth information forms
   - Social media forms

2. Move information-related constants:
   - Update `@information/constant.ts` with:
     - Personal information fields
     - Location fields
     - Contact fields
     - Social media fields
     - Other relevant constants

3. Move information-related actions:
   - Update `@information/action.ts` for:
     - Personal information updates
     - Contact information updates
     - Location updates
     - Social media updates

### 2.3 Shared Components and Utils
1. Identify shared components:
   - Form wrappers
   - Validation utilities
   - Common UI components

2. Create shared utilities:
   - Move shared validation logic
   - Move common form handlers
   - Move reusable UI components

## 3. Data Flow Updates

### 3.1 Form Submission Flow
1. Update form submission handlers:
   - Separate education form submissions
   - Separate personal information submissions
   - Maintain proper state management

2. Update validation logic:
   - Split validation rules by domain
   - Maintain shared validation utilities

### 3.2 Data Fetching
1. Update data fetching logic:
   - Separate education data queries
   - Separate personal information queries
   - Optimize data loading

## 4. Testing Plan

### 4.1 Component Testing
1. Test education components:
   - Form submissions
   - Data validation
   - UI interactions

2. Test information components:
   - Form submissions
   - Data validation
   - UI interactions

### 4.2 Integration Testing
1. Test cross-component interactions:
   - Navigation flow
   - Data persistence
   - State management

## 5. Deployment Considerations

### 5.1 Database Updates
1. Ensure Prisma schema remains compatible
2. Plan for any necessary database migrations
3. Validate data integrity

### 5.2 API Updates
1. Update API routes to reflect new structure
2. Maintain backwards compatibility
3. Update documentation

## 6. Cleanup

### 6.1 Code Cleanup
1. Remove deprecated components
2. Clean up unused imports
3. Update type definitions

### 6.2 Documentation
1. Update component documentation
2. Update API documentation
3. Update README files

## 7. Validation

### 7.1 Final Checks
1. Verify all forms work as expected
2. Confirm data persistence
3. Test navigation flow
4. Validate mobile responsiveness

### 7.2 Performance Checks
1. Verify bundle sizes
2. Check load times
3. Validate API performance

## Next Steps
1. Begin with education components migration
2. Update constants and validation rules
3. Test each component after migration
4. Deploy changes incrementally
5. Monitor for any issues
6. Update documentation 