import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Booking, Applicant, ApplicantAddress, Unit, Project, PaymentPlan } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const applicantSchema = z.object({
  applicantType: z.enum(['primary', 'co']).default('primary'),
  salutation: z.string().optional(),
  firstName: z.string().min(1, 'First name required'),
  middleName: z.string().optional(),
  lastName: z.string().min(1, 'Last name required'),
  relationType: z.string().optional(),
  relationName: z.string().optional(),
  dob: z.string().optional(),
  anniversaryDate: z.string().optional(),
  nriStatus: z.string().optional(),
  maritalStatus: z.string().optional(),
  gender: z.string().optional(),
  noOfChildren: z.number().optional(),
  passportNo: z.string().optional(),
  panNo: z.string().optional(),
  aadhaarNo: z.string().optional(),
  email1: z.string().optional(),
  email2: z.string().optional(),
  professionId: z.number().optional().nullable(),
  designation: z.string().optional(),
  companyName: z.string().optional(),
  communicationPreference: z.string().optional(),
  addresses: z.array(z.object({
    addressType: z.string().default('residential'),
    address: z.string().optional(),
    pincode: z.string().optional(),
    stateText: z.string().optional(),
    cityText: z.string().optional(),
    mobile1: z.string().optional(),
    mobile2: z.string().optional(),
    phone: z.string().optional(),
    fax: z.string().optional(),
  })).optional(),
});

const bookingSchema = z.object({
  projectId: z.number().int().positive('Select project'),
  unitId: z.number().int().positive('Select unit'),
  registrationNo: z.string().min(1, 'Registration number required'),
  formNo: z.string().optional(),
  bookingDate: z.string().min(1, 'Booking date required'),
  planId: z.number().optional().nullable(),
  basicPrice: z.number().min(0).default(0),
  perSqft: z.number().min(0).default(0),
  inauguralDiscount: z.number().min(0).default(0),
  companyDiscount: z.number().min(0).default(0),
  companyDiscountPerc: z.number().min(0).default(0),
  brokerDiscount: z.number().min(0).default(0),
  brokerId: z.number().optional().nullable(),
  teamId: z.number().optional().nullable(),
  managerId: z.number().optional().nullable(),
  employeeId: z.number().optional().nullable(),
  remarks: z.string().optional(),
  primaryApplicant: applicantSchema,
  coApplicant: applicantSchema.optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { projectId, search, status } = req.query;
      const where: any = {};
      if (projectId) where.projectId = Number(projectId);
      if (status) where.status = status;
      const bookings = await Booking.findAll({
        where,
        include: [
          { model: Project },
          { model: Unit },
          { model: Applicant, where: { applicantType: 'primary' }, required: false },
          { model: PaymentPlan },
        ],
        order: [['booking_date', 'DESC']],
        limit: 100,
      });
      return ok(res, bookings);
    }

    if (req.method === 'POST') {
      const parsed = bookingSchema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.issues[0]?.message ?? 'Validation error');

      const { primaryApplicant, coApplicant, ...bookingData } = parsed.data;
      const createdBy = (session.user as any).employeeId;

      // Check if unit is available
      const unit = await Unit.findByPk(bookingData.unitId);
      if (!unit) return badRequest(res, 'Unit not found');
      if (unit.status !== 'available') return badRequest(res, `Unit is already ${unit.status}`);

      // Create booking
      const booking = await Booking.create({ ...bookingData as any, status: 'active', createdBy });

      // Mark unit as booked
      await Unit.update({ status: 'booked' }, { where: { id: bookingData.unitId } });

      // Create primary applicant
      const { addresses: primaryAddresses, ...primaryData } = primaryApplicant;
      const primary = await Applicant.create({ ...primaryData as any, bookingId: booking.id, applicantType: 'primary' });
      if (primaryAddresses) {
        for (const addr of primaryAddresses) {
          await ApplicantAddress.create({ ...addr as any, applicantId: primary.id });
        }
      }

      // Create co-applicant if provided
      if (coApplicant) {
        const { addresses: coAddresses, ...coData } = coApplicant;
        const co = await Applicant.create({ ...coData as any, bookingId: booking.id, applicantType: 'co' });
        if (coAddresses) {
          for (const addr of coAddresses) {
            await ApplicantAddress.create({ ...addr as any, applicantId: co.id });
          }
        }
      }

      return created(res, booking, 'Booking created successfully');
    }

    if (req.method === 'PUT') {
      const { id, primaryApplicant, coApplicant, ...data } = req.body;
      if (!id) return badRequest(res, 'ID required');
      await Booking.update(data, { where: { id } });
      if (primaryApplicant) {
        const primary = await Applicant.findOne({ where: { bookingId: id, applicantType: 'primary' } });
        if (primary) await primary.update(primaryApplicant);
      }
      return ok(res, await Booking.findByPk(id), 'Updated');
    }

    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
