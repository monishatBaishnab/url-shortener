import httpStatus from 'http-status';
import AppError from '../../errors/AppError.js';
import prismaClient from '../../lib/prisma.js';
import { generateUniqueShortCode } from '../../utils/shortCode.js';

interface CreateLinkPayload {
  user_id: string;
  original_url: string;
}

export const LinkServices = {
  createLinkIntoDB: async (payload: CreateLinkPayload) => {
    // Check if user has reached the 100 link limit (count all links including deleted)
    const userTotalLinkCount = await prismaClient.link.count({
      where: {
        user_id: payload.user_id,
      },
    });

    if (userTotalLinkCount >= 100) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have reached the maximum limit of 100 shortened links. Please upgrade your account to create more links.',
      );
    }

    // Generate unique short code
    const keyword = await generateUniqueShortCode();

    // Create link
    const link = await prismaClient.link.create({
      data: {
        user_id: payload.user_id,
        original_url: payload.original_url,
        keyword,
      },
      select: {
        id: true,
        original_url: true,
        keyword: true,
        clicks: true,
        created_at: true,
        updated_at: true,
      },
    });

    return link;
  },

  getAllLinksFromDB: async (user_id: string) => {
    const links = await prismaClient.link.findMany({
      where: {
        user_id,
        is_deleted: false,
      },
      orderBy: {
        created_at: 'desc',
      },
      select: {
        id: true,
        original_url: true,
        keyword: true,
        clicks: true,
        created_at: true,
        updated_at: true,
      },
    });

    return links;
  },

  getUserLinkCountFromDB: async (user_id: string) => {
    // Count all links created by user (including deleted ones)
    const totalCount = await prismaClient.link.count({
      where: {
        user_id,
      },
    });

    return { totalCount };
  },

  getLinkByKeyFromDB: async (keyword: string, user_id: string) => {
    // Find link and throw if not found
    const link = await prismaClient.link.findFirstOrThrow({
      where: {
        keyword,
        user_id,
        is_deleted: false,
      },
    });

    return link.original_url;
  },

  deleteLinkFromDB: async (link_id: string, user_id: string) => {
    // Check if link exists and belongs to user
    const existingLink = await prismaClient.link.findFirst({
      where: {
        id: link_id,
        user_id,
        is_deleted: false,
      },
    });

    if (!existingLink) {
      throw new AppError(httpStatus.NOT_FOUND, 'Link not found.');
    }

    // Soft delete link
    await prismaClient.link.update({
      where: { id: link_id },
      data: { is_deleted: true },
    });

    return { message: 'Link deleted successfully.' };
  },
};
