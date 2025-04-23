import { expect, test, describe, vi, beforeEach } from 'vitest';
import { ArticleSchema } from './validation';
import { createArticle, updateArticle, deleteArticle, getArticleBySlug } from './action';

// Mock the database client
vi.mock('@/lib/db', () => ({
  db: {
    article: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

// Sample article data for testing
const validArticleData = {
  title: "Test Article Title",
  slug: "test-article",
  description: "This is a test article description that is at least 20 characters.",
  image: "https://example.com/test-image.jpg",
  body: "This is the body of the test article. It contains at least 50 characters to pass validation.",
  author: "Test Author",
};

describe('Article Validation', () => {
  test('validates a valid article', () => {
    const result = ArticleSchema.safeParse(validArticleData);
    expect(result.success).toBe(true);
  });

  test('rejects an article with missing fields', () => {
    const invalidData = { title: "Test" };
    const result = ArticleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('rejects an article with short title', () => {
    const invalidData = { ...validArticleData, title: "Test" };
    const result = ArticleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  test('rejects an article with invalid slug', () => {
    const invalidData = { ...validArticleData, slug: "Invalid Slug!" };
    const result = ArticleSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});

describe('Article CRUD Operations', () => {
  const mockDb = await import('@/lib/db');
  
  beforeEach(() => {
    vi.resetAllMocks();
  });

  test('createArticle creates a new article', async () => {
    mockDb.db.article.create.mockResolvedValue({
      id: "123",
      ...validArticleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await createArticle(validArticleData);
    
    expect(mockDb.db.article.create).toHaveBeenCalledWith({
      data: validArticleData,
    });
    expect(result.status).toBe('success');
  });

  test('getArticleBySlug returns an article', async () => {
    const mockArticle = {
      id: "123",
      ...validArticleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockDb.db.article.findUnique.mockResolvedValue(mockArticle);

    const article = await getArticleBySlug("test-article");
    
    expect(mockDb.db.article.findUnique).toHaveBeenCalledWith({
      where: { slug: "test-article" },
    });
    expect(article).toEqual(mockArticle);
  });

  test('updateArticle updates an existing article', async () => {
    const updatedData = { ...validArticleData, title: "Updated Title" };
    mockDb.db.article.update.mockResolvedValue({
      id: "123",
      ...updatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await updateArticle("123", updatedData);
    
    expect(mockDb.db.article.update).toHaveBeenCalledWith({
      where: { id: "123" },
      data: updatedData,
    });
    expect(result.status).toBe('success');
  });

  test('deleteArticle deletes an article', async () => {
    mockDb.db.article.delete.mockResolvedValue({
      id: "123",
      ...validArticleData,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const result = await deleteArticle("123");
    
    expect(mockDb.db.article.delete).toHaveBeenCalledWith({
      where: { id: "123" },
    });
    expect(result.status).toBe('success');
  });
});
