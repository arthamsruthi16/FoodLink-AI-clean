import { Request, Response, Router } from 'express';
import { db } from '../db';

export const notificationsRouter = Router();

notificationsRouter.get('/', (req: Request, res: Response) => {
  const userId = req.query.userId as string;
  let notifs = [...db.notifications];

  if (userId) {
    notifs = notifs.filter((n) => n.userId === userId || n.userId === 'all');
  }

  return res.json({ notifications: notifs, unreadCount: notifs.filter((n) => !n.read).length });
});

notificationsRouter.post('/', (req: Request, res: Response) => {
  const { title, message, type, linkId, userId } = req.body;
  const newNotif = {
    id: `notif_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    userId: userId || 'all',
    title: title || 'System Event',
    message: message || 'An action occurred in FoodLink AI.',
    type: type || 'system',
    read: false,
    timestamp: new Date().toISOString(),
    linkId
  };

  db.notifications.unshift(newNotif);
  return res.status(201).json({ notification: newNotif });
});

notificationsRouter.put('/:id/read', (req: Request, res: Response) => {
  const { id } = req.params;
  const notif = db.notifications.find((n) => n.id === id);
  if (notif) {
    notif.read = true;
  }
  return res.json({ success: true, notification: notif });
});
