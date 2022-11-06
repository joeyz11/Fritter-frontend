import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from './collection';
import * as userValidator from '../user/middleware';
import * as freetValidator from '../freet/middleware';
import * as stampOfHumorValidator from '../stampOfHumor/middleware';
import * as discussionValidator from '../discussion/middleware';
import * as freetUtil from '../freet/util';
import * as stampOfHumorUtil from '../stampOfHumor/util';
import * as discussionUtil from '../discussion/util';

import StampOfHumorCollection from '../stampOfHumor/collection';
import DiscussionCollection from '../discussion/collection';
import ReplyCollection from '../reply/collection';

import {Sentiment} from '../discussion/util'

const router = express.Router();

/**
 * Get all the freets (and associated stampOfHumors and discussions)
 *
 * @name GET /api/freets
 *
 * @return {FreetAndStampOfHumorResponseAndDiscussions[]} - An array of all freets (and associated stampOfHumors and discussions) sorted in descending order by date modified
 */
/**
 * Get freets (and associated stampOfHumors and discussions) by author.
 *
 * @name GET /api/freets?author=username
 *
 * @return {FreetAndStampOfHumorResponseAndDiscussions[]} - An array of freets (and associated stampOfHumors and discussions) created by user with username, author
 * @throws {400} - If author is not given
 * @throws {404} - If no user has given author
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.author !== undefined) {
      next();
      return;
    }
    // get all freets
    const allFreets = await FreetCollection.findAll();
    const response = await Promise.all(allFreets.map(async (freet) => {
      const freetId = freet._id.toString();
      const stampOfHumor = await StampOfHumorCollection.findOne(freetId);

      const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
      const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
      const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);

      return ({
        freet: freetUtil.constructFreetResponse(freet),
        stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
        supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
        neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
        opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
      })
    }));
    res.status(200).json(response);
    return;
  },
  [
    userValidator.isAuthorExists
  ],
  async (req: Request, res: Response) => {
     // get all freets from author
    const authorFreets = await FreetCollection.findAllByUsername(req.query.author as string);
    const response = await Promise.all(authorFreets.map(async (freet) => {
      const freetId = freet._id.toString();
      const stampOfHumor = await StampOfHumorCollection.findOne(freetId);

      const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
      const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
      const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);

      return ({
        freet: freetUtil.constructFreetResponse(freet),
        stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
        supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
        neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
        opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
      })
    }));
    res.status(200).json(response);
    return;
  }
);

router.get(
  '/:freetId?',
  async(req: Request, res: Response, next: NextFunction) => {
    console.log('params', req.params);
    console.log('query', req.query); 
  
    const freetId = req.params.freetId
    const freet = await FreetCollection.findOne(freetId);
    const stampOfHumor = await StampOfHumorCollection.findOne(freetId);

    const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);

    res.status(200).json({
      freet: freetUtil.constructFreetResponse(freet),
      stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
      supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
      neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
      opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
    });
    return;
  }
)

/**
 * Create a new freet (and associated stampOfHumors and discussions)
 *
 * @name POST /api/freets
 *
 * @param {string} content - The content of the freet
 * @param {string} satire - Whether the freet is satircal or not
 * @return {FreetResponse, StampOfHumorResponse, DiscussionResponse} - The created freet and associated stampOfHumor and discussions
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the freet content is empty or a stream of empty spaces, or if satire field is undefined
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isValidFreetContent,
    stampOfHumorValidator.isValidStampOfHumor
    
  ],
  async (req: Request, res: Response) => {
    // create freet
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freet = await FreetCollection.addOne(userId, req.body.content);
    const freetId = freet._id
    // create stamp of humor
    const isSatire = req.body.satire === 'true' ? true : false;
    const stampOfHumor = await StampOfHumorCollection.addOne(freetId, isSatire);
    // create 'support', 'neutral', 'oppose' discussions
    const supportDiscussion = await DiscussionCollection.addOne(freetId, Sentiment.Support);
    const neutralDiscussion = await DiscussionCollection.addOne(freetId, Sentiment.Neutral);
    const opposeDiscussion = await DiscussionCollection.addOne(freetId, Sentiment.Oppose);

    res.status(201).json({
      message: 'Your freet and stampOfHumor was created successfully.',
      freet: freetUtil.constructFreetResponse(freet),
      stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(stampOfHumor),
      supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
      neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
      opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
    });
  }
);

/**
 * Delete a freet, associated stampOfHumor, and associated discussions
 *
 * @name DELETE /api/freets/:id
 *
 * @return {string} - A success message
 * @throws {400} - If freetId is not given
 * @throws {403} - If the user is not logged in, or is not the author of
 *                 the freet or stampOfHumor
 * @throws {404} - If the freetId, stampOfHumorId, or any discussionIds are not valid
 */
router.delete(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    stampOfHumorValidator.isStampOfHumorExists,
    discussionValidator.isDiscussionsByFreetExists,
    freetValidator.isValidFreetModifier,
    stampOfHumorValidator.isValidStampOfHumorModifier,
    discussionValidator.isValidDiscussionDeleter,
  ],
  async (req: Request, res: Response) => {
    const freetId = req.params.freetId 
    // delete all replies
    const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);
    const supportDiscussionId = supportDiscussion._id;
    const neutralDiscussionId = neutralDiscussion._id;
    const opposeDiscussionId = opposeDiscussion._id;
    await ReplyCollection.deleteManyByDiscussion(supportDiscussionId)
    await ReplyCollection.deleteManyByDiscussion(neutralDiscussionId)
    await ReplyCollection.deleteManyByDiscussion(opposeDiscussionId)
    // delete discussions
    await DiscussionCollection.deleteOne(supportDiscussionId);
    await DiscussionCollection.deleteOne(neutralDiscussionId);
    await DiscussionCollection.deleteOne(opposeDiscussionId);
    // delete stamp of humor
    const stampOfHumor = await StampOfHumorCollection.findOne(freetId)
    const stampOfHumorId = stampOfHumor._id;
    await StampOfHumorCollection.deleteOne(stampOfHumorId);
    // delete freet
    await FreetCollection.deleteOne(freetId);

    res.status(200).json({
      message: 'Your freet, stampOfHumor, and discussions were deleted successfully.'
    });
  }
);

/**
 * Modify a freet (and associated stampOfHumor)
 *
 * @name PATCH /api/freets/:freetId
 *
 * @param {string} content - the new content for the freet
 * @param {string} satire - whether the new freet is satirical or not
 * @param {string} A success message
 * @return {FreetResponse, StampOfHumorResponse, DiscussionResponse} - the updated freet, stampOfHumor, and discussions
 * @throws {403} - If the user is not logged in, or if the user is not the author of the freet
 * @throws {404} - If the freetId or stampOfHumorId is not valid
 * @throws {400} - If the freet content is empty or a stream of empty spaces, or freetId is not given, or if satire field is undefined
 * @throws {413} - If the freet content is more than 140 characters long
 */
router.patch(
  '/:freetId?',
  [
    userValidator.isUserLoggedIn,
    freetValidator.isFreetExists,
    stampOfHumorValidator.isStampOfHumorExists,
    freetValidator.isValidFreetModifier,
    stampOfHumorValidator.isValidStampOfHumorModifier,
    freetValidator.isValidFreetContent,
    stampOfHumorValidator.isValidStampOfHumor
  ],
  async (req: Request, res: Response) => {
    const freetId = req.params.freetId
    const content = req.body.content
    const isSatire = req.body.satire === 'true' ? true : false;
    const freet = await FreetCollection.updateOne(freetId, content);
    const stampOfHumor = await StampOfHumorCollection.findOne(freetId)
    const newStampOfHumor = await StampOfHumorCollection.updateOne(stampOfHumor._id, isSatire)
    // get discussions
    const supportDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Support);
    const neutralDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Neutral);
    const opposeDiscussion = await DiscussionCollection.findOne(freetId, Sentiment.Oppose);
    res.status(200).json({
      message: 'Your freet was updated successfully.',
      freet: freetUtil.constructFreetResponse(freet),
      stampOfHumor: stampOfHumorUtil.constructStampOfHumorResponse(newStampOfHumor),
      supportDiscussion: discussionUtil.constructDiscussionResponse(supportDiscussion),
      neutralDiscussion: discussionUtil.constructDiscussionResponse(neutralDiscussion),
      opposeDiscussion: discussionUtil.constructDiscussionResponse(opposeDiscussion),
    });
  }
);

export {router as freetRouter};
