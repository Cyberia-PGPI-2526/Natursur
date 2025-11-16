import express from 'express';
import { requiresAuth, checkRole } from '../auth/auth.middleware.js';
import { receiveMessage } from './order.controller.js';

export const orderRoutes = express.Router();

orderRoutes.post('/message',
  requiresAuth,
  checkRole('CUSTOMER'),
  receiveMessage
);
