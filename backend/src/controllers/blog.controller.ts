import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Get published posts (Public)
export const getPublishedPosts = async (req: Request, res: Response) => {
    try {
        const { category, search } = req.query;

        const where: any = {
            isPublished: true,
        };

        if (category && category !== 'All') {
            where.category = String(category);
        }

        if (search) {
            where.OR = [
                { title: { contains: String(search), mode: 'insensitive' } },
                { content: { contains: String(search), mode: 'insensitive' } },
            ];
        }

        const posts = await prisma.blogPost.findMany({
            where,
            orderBy: { publishedAt: 'desc' },
            include: {
                author: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        res.json({ success: true, data: posts });
    } catch (error) {
        console.error("Get Posts Error:", error);
        res.status(500).json({ success: false, message: 'Failed to fetch posts' });
    }
};

// Get single post by slug (Public)
export const getPostBySlug = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;

        const post = await prisma.blogPost.findUnique({
            where: { slug },
            include: {
                author: {
                    select: { firstName: true, lastName: true }
                }
            }
        });

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch post' });
    }
};

// Create Post (Admin)
export const createPost = async (req: Request, res: Response) => {
    try {
        const { title, content, category, excerpt, coverImage, isPublished, readTime } = req.body;

        // Auto-generate slug from title if not provided
        const slug = req.body.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

        const post = await prisma.blogPost.create({
            data: {
                title,
                slug,
                content,
                category,
                excerpt,
                coverImage,
                isPublished: isPublished || false,
                publishedAt: isPublished ? new Date() : null,
                readTime: readTime || '5 min read',
                authorId: (req as any).user.userId // Assuming auth middleware sets this
            }
        });

        res.status(201).json({ success: true, data: post });
    } catch (error) {
        console.error("Create Post Error:", error);
        res.status(500).json({ success: false, message: 'Failed to create post' });
    }
};

// Update Post (Admin)
export const updatePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, content, category, excerpt, coverImage, isPublished, readTime, slug } = req.body;

        const data: any = {
            title, content, category, excerpt, coverImage, readTime, slug
        };

        if (isPublished !== undefined) {
            data.isPublished = isPublished;
            // distinct logic: if publishing now, set date. if unpublishing, keep date or null? 
            // Better: if isPublished is migrating true->false, maybe keep date. 
            // Simple: set publishedAt to now if becoming true.
            if (isPublished === true) {
                // Check if it was already published to avoid overwriting date
                const existing = await prisma.blogPost.findUnique({ where: { id }, select: { isPublished: true } });
                if (!existing?.isPublished) {
                    data.publishedAt = new Date();
                }
            }
        }

        const post = await prisma.blogPost.update({
            where: { id },
            data
        });

        res.json({ success: true, data: post });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to update post' });
    }
};

// Delete Post (Admin)
export const deletePost = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.blogPost.delete({ where: { id } });
        res.json({ success: true, message: 'Post deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete post' });
    }
};

// Get All Posts (Admin - includes drafts)
export const getAdminPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.blogPost.findMany({
            orderBy: { updatedAt: 'desc' },
            include: {
                author: {
                    select: { firstName: true, lastName: true }
                }
            }
        });
        res.json({ success: true, data: posts });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch admin posts' });
    }
};
