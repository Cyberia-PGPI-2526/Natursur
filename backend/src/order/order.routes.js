import express from 'express';
import { requiresAuth, checkRole } from '../auth/auth.middleware.js';
import { receiveMessage, receiveOrder } from './order.controller.js';

export const chatRoutes = express.Router();

chatRoutes.post('/message',
  requiresAuth,
  checkRole('CUSTOMER'),
  receiveMessage
);

chatRoutes.post('/order',
  requiresAuth,
  checkRole('CUSTOMER'),
  receiveOrder
);
