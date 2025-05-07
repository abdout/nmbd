// "use client";

// import { IssueContextProps, IssueType } from './type';
// import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { createIssue as createIssueAction, getIssues, deleteIssue as deleteIssueAction } from './action';

// const IssueContext = createContext<IssueContextProps | undefined>(undefined);

// export const useIssue = () => {
//   const context = useContext(IssueContext);
//   if (!context) {
//     throw new Error('useIssue must be used within an IssueProvider');
//   }
//   return context;
// };

// export const IssueProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [issue, setIssue] = useState<IssueType | null>(null);
//   const [issues, setIssues] = useState<IssueType[]>([]);

//   const createIssue = async (data: IssueType) => {
//     try {
//       await createIssueAction(data);
//       await fetchIssues();
//     } catch (error) {
//       console.error('Failed to create issue:', error);
//     }
//   };

//   const fetchIssue = useCallback(async (id: string) => {
//     // Implement fetch single issue if needed
//     // Placeholder: find in local state
//     const found = issues.find((i) => i._id === id) || null;
//     setIssue(found);
//   }, [issues]);

//   const fetchIssues = async () => {
//     try {
//       const { issues } = await getIssues();
//       setIssues(issues);
//     } catch (error) {
//       console.error('Failed to fetch issues:', error);
//     }
//   };

//   const deleteIssue = async (id: string) => {
//     try {
//       await deleteIssueAction(id);
//       await fetchIssues();
//     } catch (error) {
//       console.error('Failed to delete issue:', error);
//     }
//   };

//   const refreshIssues = async () => {
//     await fetchIssues();
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   const updateIssue = async (id: string, data: Partial<IssueType>) => {
//     // Implement update logic if needed
//     // Placeholder: not implemented
//     console.warn('updateIssue not implemented');
//   };

//   return (
//     <IssueContext.Provider value={{ issue, issues, fetchIssue, fetchIssues, refreshIssues, deleteIssue, updateIssue, createIssue }}>
//       {children}
//     </IssueContext.Provider>
//   );
// };