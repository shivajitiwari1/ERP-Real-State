import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

export type BookingStatus = 'active' | 'cancelled' | 'transferred' | 'surrendered';

interface BookingAttributes {
  id: number; projectId: number; unitId: number;
  registrationNo: string; formNo?: string; bookingDate: Date;
  planId?: number; rateListId?: number;
  basicPrice: number; perSqft: number;
  inauguralDiscount: number; companyDiscount: number; companyDiscountPerc: number;
  brokerDiscount: number; brokerId?: number;
  teamId?: number; managerId?: number; employeeId?: number;
  corporateId?: number; status: BookingStatus; remarks?: string; createdBy?: number;
}
interface BookingCreation extends Optional<BookingAttributes, 'id' | 'formNo' | 'planId' | 'rateListId' | 'brokerId' | 'teamId' | 'managerId' | 'employeeId' | 'corporateId' | 'remarks' | 'createdBy'> {}

class Booking extends Model<BookingAttributes, BookingCreation> implements BookingAttributes {
  public id!: number; public projectId!: number; public unitId!: number;
  public registrationNo!: string; public formNo?: string; public bookingDate!: Date;
  public planId?: number; public rateListId?: number;
  public basicPrice!: number; public perSqft!: number;
  public inauguralDiscount!: number; public companyDiscount!: number; public companyDiscountPerc!: number;
  public brokerDiscount!: number; public brokerId?: number;
  public teamId?: number; public managerId?: number; public employeeId?: number;
  public corporateId?: number; public status!: BookingStatus; public remarks?: string; public createdBy?: number;
}

Booking.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  projectId: { type: DataTypes.INTEGER, allowNull: false },
  unitId: { type: DataTypes.INTEGER, allowNull: false },
  registrationNo: { type: DataTypes.STRING(50), allowNull: false, unique: true },
  formNo: DataTypes.STRING(50),
  bookingDate: { type: DataTypes.DATEONLY, allowNull: false },
  planId: DataTypes.INTEGER,
  rateListId: DataTypes.INTEGER,
  basicPrice: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  perSqft: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  inauguralDiscount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  companyDiscount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  companyDiscountPerc: { type: DataTypes.DECIMAL(6, 2), defaultValue: 0 },
  brokerDiscount: { type: DataTypes.DECIMAL(14, 2), defaultValue: 0 },
  brokerId: DataTypes.INTEGER,
  teamId: DataTypes.INTEGER,
  managerId: DataTypes.INTEGER,
  employeeId: DataTypes.INTEGER,
  corporateId: DataTypes.INTEGER,
  status: { type: DataTypes.ENUM('active', 'cancelled', 'transferred', 'surrendered'), defaultValue: 'active' },
  remarks: DataTypes.TEXT,
  createdBy: DataTypes.INTEGER,
}, { sequelize, modelName: 'Booking', tableName: 'bookings' });

export default Booking;
