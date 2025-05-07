# Minimal Plan: Onboarding Submission to Admin Review & Approval

This guide summarizes the essential flow and technical notes for moving a user from onboarding submission to admin review and approval, based on the current codebase.

---

## 1. User Completes Onboarding

- User completes all onboarding steps (`information`, `contact`, `education`, `activity`, `attachment`, `terms`, `review`).
- On final submission (in the review step):
  - The backend sets:
    - `onboardingStatus` to `"COMPLETED"`
    - `applicationStatus` to `"PENDING"`
  - No need to show the user a status page or allow them to track their application.

**Relevant code:**  
- Onboarding steps are implemented as separate routes/components under `/onboarding/`.
- The final submission logic is in the review step component.
- After submission, the user is redirected to the home page.

---

## 2. Admin Reviews Applications

- Admins and membership secretaries access `/membership/applications`.
- This dashboard lists all users with `applicationStatus: "PENDING"`.
- Only users with the correct roles can access this dashboard.

**Relevant code:**  
- The `/membership/applications` route/component fetches and displays all pending applications.
- Access control is enforced based on user roles (`MEMBERSHIP_SECRETARY`, `ADMIN`).

---

## 3. Admin Takes Action

- For each application, the admin can:
  - **Approve**: Sets `applicationStatus` to `"APPROVED"`
  - **Reject**: Sets `applicationStatus` to `"REJECTED"`
- The backend updates the user's status accordingly.

**Relevant code:**  
- Approve/Reject actions are available in the applications dashboard.
- These actions trigger API calls to update the user's `applicationStatus`.

---

## Additional Technical Notes

- There is **no need** for a separate "suspended" state; use `applicationStatus: "PENDING"` to indicate a user is not yet a full member.
- All member-only features should check for `applicationStatus === "APPROVED"` before granting access.
- The onboarding flow is modular and can be extended with additional steps or validations if needed.
- The admin dashboard should only be visible to users with the correct roles.
- All onboarding and application status changes are handled via API endpoints, which can be further secured or audited as needed.

---

## If We Were to Execute This Plan Now: Steps & Files

**What we have already done:**
- Studied and documented the onboarding flow and admin review process.
- Identified the relevant files and components in the codebase.

**If we were to implement/execute this plan right now, the steps would be:**

### 1. Review and Audit Onboarding Flow
- **Files:**  
  - `/src/app/onboarding/*` (all onboarding step components)
  - `/src/app/onboarding/review/*` (final submission logic)
- **Actions:**  
  - Ensure that on submission, `onboardingStatus` and `applicationStatus` are set correctly in the backend.
  - Confirm user is redirected to the home page after submission.

### 2. Review Admin Applications Dashboard
- **Files:**  
  - `/src/app/membership/applications/*` (dashboard page/component)
  - Any API routes or backend logic for fetching applications
- **Actions:**  
  - Ensure the dashboard lists all users with `applicationStatus: "PENDING"`.
  - Confirm access control is enforced for `MEMBERSHIP_SECRETARY` and `ADMIN` roles.

### 3. Review Approve/Reject Actions
- **Files:**  
  - `/src/app/membership/applications/*` (where approve/reject buttons are implemented)
  - API endpoints for updating `applicationStatus`
- **Actions:**  
  - Ensure approve/reject buttons update the user's `applicationStatus` in the backend.
  - Confirm the UI updates accordingly after an action.

### 4. Audit Member-Only Features
- **Files:**  
  - Any protected routes/components (e.g., `/dashboard`, `/community`, etc.)
- **Actions:**  
  - Ensure all member-only features check for `applicationStatus === "APPROVED"`.

### 5. (Optional) Clean Up and Document
- **Files:**  
  - This guide and any related documentation files.
- **Actions:**  
  - Update documentation to reflect the current minimal flow.
  - Remove or comment out any unused notification/status-tracking code.

---

**Next Step:**  
- We will study and learn from this guide and the codebase before making any changes or executing the plan.

---

**Summary:**  
This plan ensures a minimal, clear flow: user submits onboarding → admins review in `/membership/applications` → admin approves/rejects. No user-facing status tracking or notifications are required. All necessary logic is already present or can be easily added based on the current codebase structure. 