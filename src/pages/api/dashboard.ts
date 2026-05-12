import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Receipt, Demand, Unit, Project, Applicant } from '@/models';
import { ok, unauthorized, serverError } from '@/lib/api-response';
import { Op, fn, col, literal } from 'sequelize';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  if (req.method !== 'GET') return res.status(405).end();

  try {
    const today = new Date().toISOString().split('T')[0];
    const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

    // Get all projects
    const projects = await Project.findAll({ where: { isActive: true }, order: [['name', 'ASC']] });

    const dashData = await Promise.all(projects.map(async (project) => {
      const pid = project.id;

      // Unit inventory summary
      const units = await Unit.findAll({ where: { projectId: pid } });
      const unitSummary = { available: 0, booked: 0, sold: 0, held: 0, total: units.length };
      units.forEach(u => { (unitSummary as any)[u.status] = ((unitSummary as any)[u.status] || 0) + 1; });

      // Today's collection
      const todayReceipts = await Receipt.findAll({ where: { projectId: pid, receiptDate: today, isCancelled: false } });
      const todayCollection = todayReceipts.reduce((s, r) => s + Number(r.totalAmount), 0);

      // Month collection
      const monthReceipts = await Receipt.findAll({ where: { projectId: pid, receiptDate: { [Op.gte]: monthStart }, isCancelled: false } });
      const monthCollection = monthReceipts.reduce((s, r) => s + Number(r.totalAmount), 0);

      // Till date collection
      const allReceipts = await Receipt.findAll({ where: { projectId: pid, isCancelled: false } });
      const totalCollection = allReceipts.reduce((s, r) => s + Number(r.totalAmount), 0);

      // Today's sales
      const todayBookings = await Booking.findAll({ where: { projectId: pid, bookingDate: today } });
      const todaySales = todayBookings.reduce((s, b) => s + Number(b.basicPrice), 0);

      // Month sales
      const monthBookings = await Booking.findAll({ where: { projectId: pid, bookingDate: { [Op.gte]: monthStart } } });
      const monthSales = monthBookings.reduce((s, b) => s + Number(b.basicPrice), 0);

      // Till date sales
      const allBookings = await Booking.count({ where: { projectId: pid, status: { [Op.in]: ['active', 'sold', 'transferred'] } } });

      // Pending demands (unsent)
      const pendingDemands = await Demand.count({ where: { projectId: pid, status: 'pending' } });
      const sentDemands = await Demand.count({ where: { projectId: pid, status: { [Op.in]: ['sent', 'r1', 'r2'] } } });

      // Forthcoming dues (next 28 days)
      const futureDate = new Date(); futureDate.setDate(futureDate.getDate() + 28);
      const forthcomingDues = await Demand.findAll({
        where: { projectId: pid, status: { [Op.in]: ['pending', 'sent'] }, dueDate: { [Op.between]: [today, futureDate.toISOString().split('T')[0]] } },
      });

      const dueGroups = { today: 0, week1: 0, week2: 0, week3: 0, week4: 0 };
      forthcomingDues.forEach(d => {
        if (!d.dueDate) return;
        const days = Math.ceil((new Date(d.dueDate).getTime() - new Date(today).getTime()) / 86400000);
        if (days <= 0) dueGroups.today++;
        else if (days <= 7) dueGroups.week1++;
        else if (days <= 14) dueGroups.week2++;
        else if (days <= 21) dueGroups.week3++;
        else dueGroups.week4++;
      });

      return {
        project: { id: pid, name: project.name },
        inventory: unitSummary,
        daily: { todaySales, todayCollection, monthSales, monthCollection, tillDateBookings: allBookings, tillDateCollection: totalCollection },
        demand: { pending: pendingDemands, sent: sentDemands },
        forthcomingDue: dueGroups,
      };
    }));

    return ok(res, dashData);
  } catch (err) { return serverError(res, err); }
}
