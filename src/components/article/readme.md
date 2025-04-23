# Article Management System

This system provides CRUD (Create, Read, Update, Delete) operations for articles in the application.

## Implementation Progress

- [x] Create database schema for articles
- [x] Define types and validation schemas
- [x] Implement server actions for CRUD operations
- [x] Create article form with validation
- [x] Implement image upload functionality
- [x] Create full-screen dialog for article creation and editing
- [x] Implement context menu for article management
- [x] Add confirmation dialog for article deletion
- [x] Create UI components for displaying articles

## Setup Process

### 1. Database Schema

A new `Article` model has been added to the Prisma schema with the following fields:
- `id`: Unique identifier
- `title`: Article title
- `slug`: URL-friendly unique identifier 
- `description`: Brief summary of the article
- `image`: URL of the featured image
- `body`: Main content of the article
- `author`: Author's name
- `createdAt`: Timestamp when the article was created
- `updatedAt`: Timestamp when the article was last updated

### 2. Type Definitions

Types are defined in `src/components/article/type.ts` including:
- `ArticleFormValues`: Form values for creating/editing articles
- `Article`: Database article type with ID and timestamps
- `ArticleAction`: Context menu action types (edit, delete)
- `ActionState`: Server action response state
- `ImageData`: Image upload response data

### 3. Validation

Form validation is implemented using Zod in `src/components/article/validation.ts` with rules for:
- Title (minimum 5 characters)
- Slug (minimum 3 characters, only lowercase letters, numbers, and hyphens)
- Description (minimum 20 characters)
- Image (required)
- Body (minimum 50 characters)
- Author (required)

### 4. Server Actions

Server actions are implemented in `src/components/article/action.ts` including:
- `createArticle`: Create a new article
- `getArticleBySlug`: Get a specific article by slug
- `getAllArticles`: Get all articles sorted by creation date
- `updateArticle`: Update an existing article
- `deleteArticle`: Delete an article

### 5. Components

- `ArticleForm`: Form for creating/editing articles with validation
- `ArticleDialog`: Full-screen dialog for the article form
- `ArticleCard`: Card component for displaying an article with context menu
- `ArticleGrid`: Grid layout for displaying multiple articles
- `CreateArticleButton`: Button component for adding new articles

## Usage Instructions

### Adding the Article Management to a Page

```tsx
// In your page component
import { getAllArticles } from "@/components/article/action";
import { ArticleGrid } from "@/components/article/content";

export default async function ArticlePage() {
  // Fetch articles from the database
  const articles = await getAllArticles();
  
  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Articles</h1>
      <ArticleGrid articles={articles} />
    </div>
  );
}
```

### Creating a New Article

The "Add New Article" button in the ArticleGrid component opens a dialog with a form for creating a new article.

### Editing or Deleting an Article

Right-click on an article card to open a context menu with options to:
- Edit the article
- Delete the article (with confirmation)

### Article Form Features

The article form includes:
- Auto-generation of slug from title
- Image upload with preview
- Validation for all fields
- Error handling for server actions

## Image Upload Integration

The article form integrates with the existing image upload system:

1. When an image is uploaded, the `onUploadComplete` callback is triggered
2. The image URL is stored in the form state
3. A preview of the uploaded image is displayed
4. The image URL is included in the article data when the form is submitted

## Testing

Tests are available in `src/components/article/test.ts` for:
- Validation rules
- CRUD operations

## Future Improvements

- [ ] Add rich text editor for article body
- [ ] Implement article categories/tags
- [ ] Add search functionality
- [ ] Implement pagination for articles
- [ ] Add sorting options for articles
- [ ] Create article analytics tracking
