import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as replyValidator from '../reply/middleware';
import * as upvoteValidator from '../upvote/middleware';
import * as replyUtil from '../reply/util';
import * as upvoteUtil from '../upvote/util';
import UpvoteCollection from '../upvote/collection';
import ReplyCollection from '../reply/collection';
import UserCollection from '../user/collection';

const router = express.Router();

router.get(
  '/:replyId?',
  async (req: Request, res: Response) => {
    const replyId = req.params.replyId
    const upvote = await UpvoteCollection.findOne(replyId)
    res.status(200).json({
      upvote: upvoteUtil.constructUpvoteResponse(upvote), 
    })
  }
)
/**
 * Increment upvote of associated replyId
 *
 * @name PATCH /api/upvotes/:replyId/inc
 *
 * @return {string} - A success message
 * @return {UpvoteResponse} - the updated upvote
 * @throws {400} - if replyId is not given
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the replyId is invalid
 */
router.patch(
  '/:replyId?/inc',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    upvoteValidator.isUpvoteExists,
    upvoteValidator.isValidUpvoteModifier
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const replyId = req.params.replyId
    const reply = await ReplyCollection.findOne(replyId);
    const upvote = await UpvoteCollection.findOne(replyId);
    const upvoteId = upvote._id;
    const newUpvote = await UpvoteCollection.updateOne(upvoteId, user, true);
    res.status(200).json({
      message: 'Your upvote was incremented successfully.',
      reply: replyUtil.constructReplyResponse(reply),
      upvote: upvoteUtil.constructUpvoteResponse(newUpvote),
    });
  }
);

/**
 * Decrement upvote of associated replyId
 *
 * @name PATCH /api/upvotes/:id/dec
 *
 * @return {string} - A success message
 * @return {UpvoteResponse} - the updated upvote
 * @throws {400} - if replyId is not given
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the replyId is invalid
 */
router.patch(
  '/:replyId?/dec',
  [
    userValidator.isUserLoggedIn,
    replyValidator.isReplyExists,
    upvoteValidator.isUpvoteExists,
    upvoteValidator.isValidUpvoteModifier
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const replyId = req.params.replyId
    const reply = await ReplyCollection.findOne(replyId);
    const upvote = await UpvoteCollection.findOne(replyId);
    const upvoteId = upvote._id;
    const newUpvote = await UpvoteCollection.updateOne(upvoteId, user, false);
    res.status(200).json({
      message: 'Your upvote was decremented successfully.',
      reply: replyUtil.constructReplyResponse(reply),
      upvote: upvoteUtil.constructUpvoteResponse(newUpvote),
    });
  }
);

export {router as upvoteRouter};