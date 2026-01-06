import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.js';
import validateRequest from '../../utils/vaildateRequest.js';
import { LinkControllers } from './link.controller.js';
import { LinkValidation } from './link.validation.js';

const router = Router();

/**
 * @route   POST /api/v1/links
 * @desc    Create a new short link (auto-generates unique short code)
 * @access  Private
 */
router.post(
  '/',
  authenticate,
  validateRequest(LinkValidation.createLinkSchema),
  LinkControllers.createLink,
);

/**
 * @route   GET /api/v1/links
 * @desc    Get all links for authenticated user
 * @access  Private
 */
router.get('/', authenticate, LinkControllers.getAllLinks);

/**
 * @route   GET /api/v1/links/key/:key
 * @desc    Get a single link by short code (keyword)
 * @access  Private
 */
router.get('/key/:key', authenticate, LinkControllers.getLinkByKey);

/**
 * @route   DELETE /api/v1/links/:id
 * @desc    Delete a link (soft delete)
 * @access  Private
 */
router.delete('/:id', authenticate, LinkControllers.deleteLink);

export const LinkRoutes = router;
