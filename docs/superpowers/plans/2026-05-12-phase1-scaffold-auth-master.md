# RealBoost ERP — Phase 1: Scaffold + Auth + Set Master

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold the Next.js project, connect MySQL via Sequelize, implement role-based auth with NextAuth.js, and build the entire Set Master module (Company, Employees, Departments, Roles, Users, Banks, Lookups, Security).

**Architecture:** Next.js 14 Pages Router. All data mutations go through `/pages/api/` REST endpoints protected by NextAuth session + role checks. Sequelize models define the MySQL schema and are synced on startup. UI uses Tailwind + shadcn/ui components in a shared layout that matches the original ERP nav.

**Tech Stack:** Next.js 14 (Pages Router) · TypeScript · MySQL (XAMPP) · Sequelize + mysql2 · NextAuth.js · bcryptjs · Tailwind CSS · shadcn/ui · React Hook Form · Zod · TanStack React Query · lucide-react · dayjs

---

## File Map

```
e:\Demo Website\ERP\
├── .env.local                          DB + NextAuth env vars
├── next.config.js                      Next.js config
├── tailwind.config.ts                  Tailwind + shadcn paths
├── components.json                     shadcn/ui config
│
├── src/
│   ├── lib/
│   │   ├── db.ts                       Sequelize singleton
│   │   ├── auth.ts                     NextAuth config (credentials provider)
│   │   └── api-response.ts             Shared { success, data, message } helper
│   │
│   ├── models/
│   │   ├── index.ts                    Model registry + associations
│   │   ├── Company.ts
│   │   ├── Department.ts
│   │   ├── Employee.ts
│   │   ├── User.ts
│   │   ├── Role.ts
│   │   ├── RoleMenu.ts
│   │   ├── BankCompany.ts
│   │   ├── BankCustomer.ts
│   │   ├── BankLoan.ts
│   │   ├── Currency.ts
│   │   ├── Profession.ts
│   │   ├── Country.ts
│   │   ├── State.ts
│   │   ├── City.ts
│   │   ├── AreaType.ts
│   │   ├── ProjectType.ts
│   │   ├── DocumentType.ts
│   │   └── LetterTemplate.ts
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx           Wraps all authenticated pages
│   │   │   ├── TopBar.tsx              Logo + user info + logout
│   │   │   └── NavMenu.tsx             7-module dropdown nav (matches original ERP)
│   │   └── shared/
│   │       ├── DataTable.tsx           Reusable sortable/paginated table
│   │       ├── FormField.tsx           Label + input wrapper
│   │       ├── PageHeader.tsx          Title + breadcrumb
│   │       └── ConfirmDialog.tsx       Delete confirmation modal
│   │
│   ├── pages/
│   │   ├── _app.tsx                    QueryClientProvider + SessionProvider
│   │   ├── _document.tsx
│   │   ├── index.tsx                   Dashboard (placeholder for Phase 9)
│   │   ├── login.tsx                   Login form
│   │   ├── 403.tsx                     Access denied page
│   │   │
│   │   ├── master/
│   │   │   ├── company.tsx             Company Creation
│   │   │   ├── setup/
│   │   │   │   ├── project-type.tsx
│   │   │   │   ├── area-type.tsx
│   │   │   │   ├── currency.tsx
│   │   │   │   ├── profession.tsx
│   │   │   │   ├── country.tsx
│   │   │   │   ├── letterhead.tsx
│   │   │   │   ├── reminders.tsx
│   │   │   │   └── bank/
│   │   │   │       ├── company.tsx
│   │   │   │       ├── customer.tsx
│   │   │   │       └── loan.tsx
│   │   │   ├── employee/
│   │   │   │   ├── department.tsx
│   │   │   │   ├── info.tsx
│   │   │   │   ├── report.tsx
│   │   │   │   ├── manager.tsx
│   │   │   │   ├── team.tsx
│   │   │   │   └── tree.tsx
│   │   │   ├── login/
│   │   │   │   ├── create.tsx
│   │   │   │   └── view.tsx
│   │   │   ├── security/
│   │   │   │   ├── password.tsx
│   │   │   │   ├── history.tsx
│   │   │   │   └── ip.tsx
│   │   │   ├── roles/
│   │   │   │   ├── create.tsx
│   │   │   │   └── menus.tsx
│   │   │   └── admin/
│   │   │       ├── audit.tsx
│   │   │       ├── receipt-lock.tsx
│   │   │       ├── delete-customer.tsx
│   │   │       └── delete-receipt.tsx
│   │   │
│   │   └── api/
│   │       ├── auth/
│   │       │   └── [...nextauth].ts    NextAuth handler
│   │       └── master/
│   │           ├── company.ts
│   │           ├── setup/
│   │           │   ├── project-type.ts
│   │           │   ├── area-type.ts
│   │           │   ├── currency.ts
│   │           │   ├── profession.ts
│   │           │   ├── country.ts
│   │           │   └── bank/
│   │           │       ├── company.ts
│   │           │       ├── customer.ts
│   │           │       └── loan.ts
│   │           ├── employee/
│   │           │   ├── department.ts
│   │           │   ├── info.ts
│   │           │   └── team.ts
│   │           ├── users.ts
│   │           ├── roles.ts
│   │           └── role-menus.ts
│   │
│   └── middleware.ts                   Route protection by session + allowedPages
```

---

## Task 1: Scaffold Next.js Project

**Files:**
- Create: all project root files via CLI

- [ ] Open terminal in `e:\Demo Website\ERP\` and run:

```bash
npx create-next-app@14 . --typescript --tailwind --eslint --no-app --src-dir --import-alias "@/*"
```

Answer the prompts:
- Would you like to use App Router? → **No**
- All other defaults → **Yes / Enter**

- [ ] Install all dependencies:

```bash
npm install sequelize mysql2 bcryptjs next-auth
npm install @tanstack/react-query axios dayjs
npm install react-hook-form @hookform/resolvers zod
npm install nodemailer multer
npm install lucide-react clsx tailwind-merge class-variance-authority
npm install @radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-dropdown-menu @radix-ui/react-label @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-toast
npm install -D @types/bcryptjs @types/nodemailer @types/multer
```

- [ ] Initialize shadcn/ui:

```bash
npx shadcn-ui@latest init
```

Prompts:
- Style: **Default**
- Base color: **Slate**
- CSS variables: **Yes**

- [ ] Install shadcn components we'll use throughout:

```bash
npx shadcn-ui@latest add button input label select table dialog card badge toast form
```

- [ ] Create `.env.local` in project root:

```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=realboost_erp
DB_USER=root
DB_PASS=

NEXTAUTH_SECRET=realboost-erp-secret-key-change-in-prod
NEXTAUTH_URL=http://localhost:3000
```

- [ ] Delete the default Next.js boilerplate content — replace `src/pages/index.tsx` with:

```tsx
export default function Home() {
  return <div>RealBoost ERP</div>;
}
```

- [ ] Run dev server to confirm scaffold works:

```bash
npm run dev
```

Open `http://localhost:3000` — should show "RealBoost ERP". Stop server with Ctrl+C.

- [ ] Commit:

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 Pages Router project with Tailwind and shadcn/ui"
```

---

## Task 2: Database Connection (Sequelize + MySQL)

**Files:**
- Create: `src/lib/db.ts`

- [ ] Create `src/lib/db.ts`:

```typescript
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
  process.env.DB_NAME!,
  process.env.DB_USER!,
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: { max: 10, min: 0, acquire: 30000, idle: 10000 },
    define: { timestamps: true, underscored: true },
  }
);

export default sequelize;
```

- [ ] Create `src/lib/api-response.ts`:

```typescript
import { NextApiResponse } from 'next';

export function ok(res: NextApiResponse, data: unknown, message = 'Success') {
  return res.status(200).json({ success: true, data, message });
}

export function created(res: NextApiResponse, data: unknown, message = 'Created') {
  return res.status(201).json({ success: true, data, message });
}

export function badRequest(res: NextApiResponse, message: string) {
  return res.status(400).json({ success: false, data: null, message });
}

export function unauthorized(res: NextApiResponse) {
  return res.status(401).json({ success: false, data: null, message: 'Unauthorized' });
}

export function forbidden(res: NextApiResponse) {
  return res.status(403).json({ success: false, data: null, message: 'Forbidden' });
}

export function serverError(res: NextApiResponse, error: unknown) {
  console.error(error);
  return res.status(500).json({ success: false, data: null, message: 'Server error' });
}
```

- [ ] Test DB connection — create `src/pages/api/health.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import sequelize from '@/lib/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await sequelize.authenticate();
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: String(err) });
  }
}
```

- [ ] Start XAMPP → Start MySQL → Start Apache. Then run:

```bash
npm run dev
```

Open `http://localhost:3000/api/health` — should return:
```json
{ "status": "ok", "db": "connected" }
```

- [ ] Commit:

```bash
git add .
git commit -m "feat: add Sequelize MySQL connection with health check endpoint"
```

---

## Task 3: Core Sequelize Models (Master Group)

**Files:**
- Create: `src/models/Company.ts`, `src/models/Department.ts`, `src/models/Role.ts`, `src/models/RoleMenu.ts`, `src/models/Employee.ts`, `src/models/User.ts`, `src/models/index.ts`
- Create: `src/models/BankCompany.ts`, `src/models/BankCustomer.ts`, `src/models/BankLoan.ts`
- Create: `src/models/Currency.ts`, `src/models/Profession.ts`, `src/models/Country.ts`, `src/models/State.ts`, `src/models/City.ts`, `src/models/AreaType.ts`, `src/models/ProjectType.ts`, `src/models/DocumentType.ts`, `src/models/LetterTemplate.ts`

- [ ] Create `src/models/Company.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface CompanyAttributes {
  id: number; code: string; groupName: string; name: string;
  address1: string; address2?: string; address3?: string;
  city: string; state: string; country: string; pin: string;
  phone?: string; fax?: string; email?: string; website?: string;
  cin?: string; serviceTaxNo?: string; panNo?: string; vatRegNo?: string;
  payableAt?: string; logo?: string;
}
interface CompanyCreation extends Optional<CompanyAttributes, 'id' | 'address2' | 'address3' | 'phone' | 'fax' | 'email' | 'website' | 'cin' | 'serviceTaxNo' | 'panNo' | 'vatRegNo' | 'payableAt' | 'logo'> {}

class Company extends Model<CompanyAttributes, CompanyCreation> implements CompanyAttributes {
  public id!: number; public code!: string; public groupName!: string;
  public name!: string; public address1!: string; public address2?: string;
  public address3?: string; public city!: string; public state!: string;
  public country!: string; public pin!: string; public phone?: string;
  public fax?: string; public email?: string; public website?: string;
  public cin?: string; public serviceTaxNo?: string; public panNo?: string;
  public vatRegNo?: string; public payableAt?: string; public logo?: string;
}

Company.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  groupName: { type: DataTypes.STRING(100), allowNull: false },
  name: { type: DataTypes.STRING(200), allowNull: false },
  address1: { type: DataTypes.TEXT, allowNull: false },
  address2: DataTypes.TEXT,
  address3: DataTypes.TEXT,
  city: { type: DataTypes.STRING(100), allowNull: false },
  state: { type: DataTypes.STRING(100), allowNull: false },
  country: { type: DataTypes.STRING(100), allowNull: false },
  pin: { type: DataTypes.STRING(20), allowNull: false },
  phone: DataTypes.STRING(50),
  fax: DataTypes.STRING(50),
  email: DataTypes.STRING(150),
  website: DataTypes.STRING(200),
  cin: DataTypes.STRING(50),
  serviceTaxNo: DataTypes.STRING(50),
  panNo: DataTypes.STRING(20),
  vatRegNo: DataTypes.STRING(50),
  payableAt: DataTypes.STRING(100),
  logo: DataTypes.STRING(500),
}, { sequelize, modelName: 'Company', tableName: 'companies' });

export default Company;
```

- [ ] Create `src/models/Department.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface DeptAttributes { id: number; name: string; }
interface DeptCreation extends Optional<DeptAttributes, 'id'> {}

class Department extends Model<DeptAttributes, DeptCreation> implements DeptAttributes {
  public id!: number; public name!: string;
}

Department.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { sequelize, modelName: 'Department', tableName: 'departments' });

export default Department;
```

- [ ] Create `src/models/Role.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface RoleAttributes { id: number; name: string; description?: string; }
interface RoleCreation extends Optional<RoleAttributes, 'id' | 'description'> {}

class Role extends Model<RoleAttributes, RoleCreation> implements RoleAttributes {
  public id!: number; public name!: string; public description?: string;
}

Role.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  description: DataTypes.TEXT,
}, { sequelize, modelName: 'Role', tableName: 'roles' });

export default Role;
```

- [ ] Create `src/models/RoleMenu.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface RoleMenuAttributes {
  id: number; roleId: number; pageUrl: string; pageName: string;
  category: string; canView: boolean;
}
interface RoleMenuCreation extends Optional<RoleMenuAttributes, 'id'> {}

class RoleMenu extends Model<RoleMenuAttributes, RoleMenuCreation> implements RoleMenuAttributes {
  public id!: number; public roleId!: number; public pageUrl!: string;
  public pageName!: string; public category!: string; public canView!: boolean;
}

RoleMenu.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  pageUrl: { type: DataTypes.STRING(200), allowNull: false },
  pageName: { type: DataTypes.STRING(200), allowNull: false },
  category: { type: DataTypes.STRING(100), allowNull: false },
  canView: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'RoleMenu', tableName: 'role_menus' });

export default RoleMenu;
```

- [ ] Create `src/models/Employee.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

export type RoleType = 'employee' | 'call_center';

interface EmpAttributes {
  id: number; code: string; salutation: string;
  firstName: string; middleName?: string; lastName: string;
  departmentId: number; designation?: string;
  mobile: string; email: string;
  isAdmin: boolean; isTransfer: boolean; roleType: RoleType;
  managerId?: number; joiningDate?: Date; isActive: boolean;
}
interface EmpCreation extends Optional<EmpAttributes, 'id' | 'middleName' | 'designation' | 'managerId' | 'joiningDate'> {}

class Employee extends Model<EmpAttributes, EmpCreation> implements EmpAttributes {
  public id!: number; public code!: string; public salutation!: string;
  public firstName!: string; public middleName?: string; public lastName!: string;
  public departmentId!: number; public designation?: string;
  public mobile!: string; public email!: string;
  public isAdmin!: boolean; public isTransfer!: boolean; public roleType!: RoleType;
  public managerId?: number; public joiningDate?: Date; public isActive!: boolean;
}

Employee.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING(20), allowNull: false, unique: true },
  salutation: { type: DataTypes.STRING(10), allowNull: false },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  middleName: DataTypes.STRING(100),
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  departmentId: { type: DataTypes.INTEGER, allowNull: false },
  designation: DataTypes.STRING(100),
  mobile: { type: DataTypes.STRING(20), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false },
  isAdmin: { type: DataTypes.BOOLEAN, defaultValue: false },
  isTransfer: { type: DataTypes.BOOLEAN, defaultValue: false },
  roleType: { type: DataTypes.ENUM('employee', 'call_center'), defaultValue: 'employee' },
  managerId: DataTypes.INTEGER,
  joiningDate: DataTypes.DATEONLY,
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
}, { sequelize, modelName: 'Employee', tableName: 'employees' });

export default Employee;
```

- [ ] Create `src/models/User.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface UserAttributes {
  id: number; employeeId: number; username: string;
  passwordHash: string; roleId: number; isActive: boolean; lastLogin?: Date;
}
interface UserCreation extends Optional<UserAttributes, 'id' | 'lastLogin'> {}

class User extends Model<UserAttributes, UserCreation> implements UserAttributes {
  public id!: number; public employeeId!: number; public username!: string;
  public passwordHash!: string; public roleId!: number;
  public isActive!: boolean; public lastLogin?: Date;
}

User.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  employeeId: { type: DataTypes.INTEGER, allowNull: false },
  username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING(255), allowNull: false },
  roleId: { type: DataTypes.INTEGER, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  lastLogin: DataTypes.DATE,
}, { sequelize, modelName: 'User', tableName: 'users' });

export default User;
```

- [ ] Create `src/models/BankCompany.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface BankCompanyAttributes {
  id: number; bankName: string; accountNo: string; ifsc: string; branch: string; city: string;
}
interface BankCompanyCreation extends Optional<BankCompanyAttributes, 'id'> {}

class BankCompany extends Model<BankCompanyAttributes, BankCompanyCreation> implements BankCompanyAttributes {
  public id!: number; public bankName!: string; public accountNo!: string;
  public ifsc!: string; public branch!: string; public city!: string;
}

BankCompany.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  accountNo: { type: DataTypes.STRING(50), allowNull: false },
  ifsc: { type: DataTypes.STRING(20), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'BankCompany', tableName: 'banks_company' });

export default BankCompany;
```

- [ ] Create `src/models/BankCustomer.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface BankCustomerAttributes { id: number; bankName: string; branch: string; city: string; }
interface BankCustomerCreation extends Optional<BankCustomerAttributes, 'id'> {}

class BankCustomer extends Model<BankCustomerAttributes, BankCustomerCreation> implements BankCustomerAttributes {
  public id!: number; public bankName!: string; public branch!: string; public city!: string;
}

BankCustomer.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  city: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'BankCustomer', tableName: 'banks_customer' });

export default BankCustomer;
```

- [ ] Create `src/models/BankLoan.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';

interface BankLoanAttributes {
  id: number; bankName: string; branch: string; contactPerson?: string; contactNo?: string;
}
interface BankLoanCreation extends Optional<BankLoanAttributes, 'id' | 'contactPerson' | 'contactNo'> {}

class BankLoan extends Model<BankLoanAttributes, BankLoanCreation> implements BankLoanAttributes {
  public id!: number; public bankName!: string; public branch!: string;
  public contactPerson?: string; public contactNo?: string;
}

BankLoan.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  bankName: { type: DataTypes.STRING(150), allowNull: false },
  branch: { type: DataTypes.STRING(150), allowNull: false },
  contactPerson: DataTypes.STRING(100),
  contactNo: DataTypes.STRING(20),
}, { sequelize, modelName: 'BankLoan', tableName: 'banks_loan' });

export default BankLoan;
```

- [ ] Create `src/models/Currency.ts`, `src/models/Profession.ts`, `src/models/AreaType.ts`, `src/models/ProjectType.ts`, `src/models/DocumentType.ts` — all follow the same simple pattern (id + name):

```typescript
// src/models/Currency.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; name: string; symbol: string; exchangeRate: number; }
interface Creation extends Optional<Attrs, 'id'> {}
class Currency extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public symbol!: string; public exchangeRate!: number;
}
Currency.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(50), allowNull: false },
  symbol: { type: DataTypes.STRING(10), allowNull: false },
  exchangeRate: { type: DataTypes.DECIMAL(10, 4), defaultValue: 1 },
}, { sequelize, modelName: 'Currency', tableName: 'currencies' });
export default Currency;
```

```typescript
// src/models/Profession.ts
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}
class Profession extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string;
}
Profession.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
}, { sequelize, modelName: 'Profession', tableName: 'professions' });
export default Profession;
```

```typescript
// src/models/AreaType.ts — same pattern as Profession, tableName: 'area_types'
// src/models/ProjectType.ts — same pattern, tableName: 'project_types'
// src/models/DocumentType.ts — same pattern, tableName: 'document_types'
```

- [ ] Create `src/models/Country.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; name: string; phoneCode?: string; }
interface Creation extends Optional<Attrs, 'id' | 'phoneCode'> {}
class Country extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public phoneCode?: string;
}
Country.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  phoneCode: DataTypes.STRING(10),
}, { sequelize, modelName: 'Country', tableName: 'countries' });
export default Country;
```

- [ ] Create `src/models/State.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; countryId: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}
class State extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public countryId!: number; public name!: string;
}
State.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  countryId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'State', tableName: 'states' });
export default State;
```

- [ ] Create `src/models/City.ts` (same pattern as State but references stateId):

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; stateId: number; name: string; }
interface Creation extends Optional<Attrs, 'id'> {}
class City extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public stateId!: number; public name!: string;
}
City.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  stateId: { type: DataTypes.INTEGER, allowNull: false },
  name: { type: DataTypes.STRING(100), allowNull: false },
}, { sequelize, modelName: 'City', tableName: 'cities' });
export default City;
```

- [ ] Create `src/models/LetterTemplate.ts`:

```typescript
import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '@/lib/db';
interface Attrs { id: number; name: string; content: string; headFormat?: string; }
interface Creation extends Optional<Attrs, 'id' | 'headFormat'> {}
class LetterTemplate extends Model<Attrs, Creation> implements Attrs {
  public id!: number; public name!: string; public content!: string; public headFormat?: string;
}
LetterTemplate.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  content: { type: DataTypes.TEXT('long'), allowNull: false },
  headFormat: DataTypes.TEXT,
}, { sequelize, modelName: 'LetterTemplate', tableName: 'letter_templates' });
export default LetterTemplate;
```

- [ ] Create `src/models/index.ts` (registers all models + associations + syncs DB):

```typescript
import sequelize from '@/lib/db';
import Company from './Company';
import Department from './Department';
import Role from './Role';
import RoleMenu from './RoleMenu';
import Employee from './Employee';
import User from './User';
import BankCompany from './BankCompany';
import BankCustomer from './BankCustomer';
import BankLoan from './BankLoan';
import Currency from './Currency';
import Profession from './Profession';
import Country from './Country';
import State from './State';
import City from './City';
import AreaType from './AreaType';
import ProjectType from './ProjectType';
import DocumentType from './DocumentType';
import LetterTemplate from './LetterTemplate';

// Associations
Role.hasMany(RoleMenu, { foreignKey: 'roleId', as: 'menus' });
RoleMenu.belongsTo(Role, { foreignKey: 'roleId' });

Department.hasMany(Employee, { foreignKey: 'departmentId' });
Employee.belongsTo(Department, { foreignKey: 'departmentId' });

Employee.hasOne(User, { foreignKey: 'employeeId' });
User.belongsTo(Employee, { foreignKey: 'employeeId' });
User.belongsTo(Role, { foreignKey: 'roleId' });

Employee.belongsTo(Employee, { foreignKey: 'managerId', as: 'manager' });
Employee.hasMany(Employee, { foreignKey: 'managerId', as: 'reports' });

Country.hasMany(State, { foreignKey: 'countryId' });
State.belongsTo(Country, { foreignKey: 'countryId' });
State.hasMany(City, { foreignKey: 'stateId' });
City.belongsTo(State, { foreignKey: 'stateId' });

export async function syncDatabase() {
  await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
}

export {
  sequelize, Company, Department, Role, RoleMenu, Employee, User,
  BankCompany, BankCustomer, BankLoan, Currency, Profession,
  Country, State, City, AreaType, ProjectType, DocumentType, LetterTemplate,
};
```

- [ ] Call `syncDatabase()` on app start — create `src/pages/api/sync.ts` (dev only):

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { syncDatabase } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') return res.status(404).end();
  await syncDatabase();
  res.json({ success: true, message: 'Database synced' });
}
```

- [ ] Run the dev server and call `http://localhost:3000/api/sync` — check phpMyAdmin to confirm all tables are created in `realboost_erp`.

- [ ] Commit:

```bash
git add .
git commit -m "feat: add all Phase 1 Sequelize models and sync to MySQL"
```

---

## Task 4: Authentication (NextAuth + bcrypt)

**Files:**
- Create: `src/lib/auth.ts`, `src/pages/api/auth/[...nextauth].ts`, `src/pages/login.tsx`, `src/pages/403.tsx`, `src/middleware.ts`

- [ ] Create `src/lib/auth.ts`:

```typescript
import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User, Employee, Role, RoleMenu } from '@/models';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        const user = await User.findOne({
          where: { username: credentials.username, isActive: true },
          include: [
            { model: Employee },
            { model: Role, include: [{ model: RoleMenu, as: 'menus' }] },
          ],
        });
        if (!user) return null;
        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;
        await user.update({ lastLogin: new Date() });
        const role = (user as any).Role;
        const allowedPages: string[] = role?.menus?.map((m: any) => m.pageUrl) ?? [];
        return {
          id: String(user.id),
          name: `${(user as any).Employee?.firstName} ${(user as any).Employee?.lastName}`,
          email: (user as any).Employee?.email,
          roleId: user.roleId,
          employeeId: user.employeeId,
          allowedPages,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roleId = (user as any).roleId;
        token.employeeId = (user as any).employeeId;
        token.allowedPages = (user as any).allowedPages;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        roleId: token.roleId as number,
        employeeId: token.employeeId as number,
        allowedPages: token.allowedPages as string[],
      };
      return session;
    },
  },
  pages: { signIn: '/login' },
  session: { strategy: 'jwt', maxAge: 8 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
};
```

- [ ] Create `src/pages/api/auth/[...nextauth].ts`:

```typescript
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
export default NextAuth(authOptions);
```

- [ ] Extend the NextAuth session type — create `src/types/next-auth.d.ts`:

```typescript
import 'next-auth';
declare module 'next-auth' {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roleId: number;
      employeeId: number;
      allowedPages: string[];
    };
  }
}
```

- [ ] Create `src/middleware.ts` (route protection):

```typescript
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token as any;
    // Public paths — no check
    const publicPaths = ['/login', '/403', '/tools'];
    if (publicPaths.some(p => pathname.startsWith(p))) return NextResponse.next();
    // Dashboard always allowed when logged in
    if (pathname === '/') return NextResponse.next();
    // Check role-based page access
    const allowedPages: string[] = token?.allowedPages ?? [];
    const hasAccess = allowedPages.some(p => pathname.startsWith(p));
    if (!hasAccess) return NextResponse.redirect(new URL('/403', req.url));
    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

- [ ] Create `src/pages/login.tsx`:

```tsx
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  username: z.string().min(1, 'Username required'),
  password: z.string().min(1, 'Password required'),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function onSubmit(data: FormData) {
    setError('');
    const result = await signIn('credentials', {
      username: data.username, password: data.password, redirect: false,
    });
    if (result?.error) { setError('Invalid username or password'); return; }
    router.push('/');
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-sm border-2 border-teal-600">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-orange-500">RealBoost</h1>
          <p className="text-sm text-gray-500">Real Estate Manager</p>
          <div className="mt-2 bg-orange-400 text-white text-center py-1 px-4 rounded font-semibold text-sm">
            Sign In
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="username">User Name:</Label>
            <Input id="username" {...register('username')} autoFocus />
            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Password:</Label>
            <Input id="password" type="password" {...register('password')} />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'SIGN IN'}
          </Button>
        </form>
        <div className="mt-6 pt-4 border-t text-center text-xs text-gray-500 space-x-4">
          <a href="/tools/area-conversion" className="hover:underline">Area Conversion</a>
          <span>|</span>
          <a href="/tools/emi-calculator" className="hover:underline">E.M.I Calculator</a>
          <span>|</span>
          <a href="/tools/my-ip" className="hover:underline">Check your IP Address</a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Create `src/pages/403.tsx`:

```tsx
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-700 mb-2">403</h1>
        <p className="text-gray-500 mb-6">You do not have permission to access this page.</p>
        <Button onClick={() => router.push('/')}>Go to Dashboard</Button>
      </div>
    </div>
  );
}
```

- [ ] Seed the first admin user — create `src/pages/api/seed.ts` (dev only):

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import { syncDatabase, Department, Role, RoleMenu, Employee, User } from '@/models';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'development') return res.status(404).end();
  await syncDatabase();

  // Create Admin role with access to all pages
  const [role] = await Role.findOrCreate({ where: { name: 'Admin' }, defaults: { description: 'Full access' } });

  // Create IT department
  const [dept] = await Department.findOrCreate({ where: { name: 'IT' } });

  // Create admin employee
  const [emp] = await Employee.findOrCreate({
    where: { code: 'EMP001' },
    defaults: {
      code: 'EMP001', salutation: 'Mr.', firstName: 'Admin',
      lastName: 'User', departmentId: dept.id, mobile: '9999999999',
      email: 'admin@realboost.com', isAdmin: true, isTransfer: false,
      roleType: 'employee', isActive: true,
    },
  });

  // Create admin login
  const passwordHash = await bcrypt.hash('admin@123', 12);
  const [user] = await User.findOrCreate({
    where: { username: 'admin' },
    defaults: { employeeId: emp.id, username: 'admin', passwordHash, roleId: role.id, isActive: true },
  });

  res.json({ success: true, message: 'Seeded', userId: user.id });
}
```

- [ ] Run dev server. Call `http://localhost:3000/api/seed` — should return `{ success: true }`.

- [ ] Test login: open `http://localhost:3000/login` → enter `admin` / `admin@123` → should redirect to `/`.

- [ ] Commit:

```bash
git add .
git commit -m "feat: add NextAuth credentials auth with role-based JWT session and login page"
```

---

## Task 5: App Layout (Nav + TopBar)

**Files:**
- Create: `src/components/layout/AppLayout.tsx`, `src/components/layout/TopBar.tsx`, `src/components/layout/NavMenu.tsx`
- Modify: `src/pages/_app.tsx`

- [ ] Create `src/components/layout/TopBar.tsx`:

```tsx
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function TopBar() {
  const { data: session } = useSession();
  return (
    <div className="bg-white border-b flex items-center justify-between px-4 py-2">
      <div className="flex items-center gap-3">
        <span className="text-lg font-bold text-teal-700">Real Estate Manager</span>
      </div>
      <div className="flex items-center gap-4 text-sm text-gray-600">
        <span>Welcome, {session?.user?.name}</span>
        <Link href="/" className="hover:text-teal-700">Home</Link>
        <button onClick={() => signOut({ callbackUrl: '/login' })} className="hover:text-red-600">
          Logout
        </button>
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
      </div>
    </div>
  );
}
```

- [ ] Create `src/components/layout/NavMenu.tsx` with the full 7-module dropdown nav:

```tsx
import Link from 'next/link';
import { useState } from 'react';

const NAV = [
  {
    label: 'Set Master', items: [
      { label: 'Company Creation', href: '/master/company' },
      { label: 'Set Up', children: [
        { label: 'Project Type', href: '/master/setup/project-type' },
        { label: 'Area Type', href: '/master/setup/area-type' },
        { label: 'Currency', href: '/master/setup/currency' },
        { label: 'Profession', href: '/master/setup/profession' },
        { label: 'Company Bank', href: '/master/setup/bank/company' },
        { label: 'Customer Bank', href: '/master/setup/bank/customer' },
        { label: 'Loan Bank', href: '/master/setup/bank/loan' },
        { label: 'Country', href: '/master/setup/country' },
        { label: 'Letter Head', href: '/master/setup/letterhead' },
        { label: 'Activity Reminders', href: '/master/setup/reminders' },
      ]},
      { label: 'Employee', children: [
        { label: 'Department', href: '/master/employee/department' },
        { label: 'Employee Info', href: '/master/employee/info' },
        { label: 'Report', href: '/master/employee/report' },
        { label: 'Set Manager', href: '/master/employee/manager' },
        { label: 'Team Master', href: '/master/employee/team' },
        { label: 'Employee Tree', href: '/master/employee/tree' },
      ]},
      { label: 'Login', children: [
        { label: 'Create Login', href: '/master/login/create' },
        { label: 'View Login', href: '/master/login/view' },
      ]},
      { label: 'Security', children: [
        { label: 'Change Password', href: '/master/security/password' },
        { label: 'Login History', href: '/master/security/history' },
        { label: 'IP Security', href: '/master/security/ip' },
      ]},
      { label: 'Roles', children: [
        { label: 'Role Creation', href: '/master/roles/create' },
        { label: 'Role Wise Menus', href: '/master/roles/menus' },
      ]},
    ],
  },
  { label: 'Set Projects', href: '/projects', items: [] },
  { label: 'Application', href: '/application', items: [] },
  { label: 'Reports', href: '/reports', items: [] },
  { label: 'Broker', href: '/broker', items: [] },
  { label: 'Email / SMS', href: '/communication', items: [] },
  { label: 'Possession', href: '/possession', items: [] },
];

export default function NavMenu() {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <nav className="bg-slate-800 text-white">
      <ul className="flex">
        {NAV.map(module => (
          <li key={module.label} className="relative group"
            onMouseEnter={() => setOpen(module.label)}
            onMouseLeave={() => setOpen(null)}>
            <button className="px-4 py-3 text-sm font-medium hover:bg-slate-700 flex items-center gap-1">
              {module.label} {module.items?.length > 0 && <span>▾</span>}
            </button>
            {open === module.label && module.items?.length > 0 && (
              <ul className="absolute left-0 top-full bg-white text-gray-800 shadow-lg z-50 min-w-48 border">
                {module.items.map(item => (
                  <li key={item.label} className="relative group/sub">
                    {'href' in item && !('children' in item) ? (
                      <Link href={item.href!} className="block px-4 py-2 text-sm hover:bg-orange-50">
                        {item.label}
                      </Link>
                    ) : (
                      <>
                        <span className="block px-4 py-2 text-sm hover:bg-orange-50 cursor-default flex justify-between">
                          {item.label} <span>▶</span>
                        </span>
                        {'children' in item && (
                          <ul className="absolute left-full top-0 bg-white shadow-lg border min-w-48 hidden group-hover/sub:block z-50">
                            {(item as any).children.map((child: any) => (
                              <li key={child.label}>
                                <Link href={child.href} className="block px-4 py-2 text-sm hover:bg-orange-50">
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
```

- [ ] Create `src/components/layout/AppLayout.tsx`:

```tsx
import { ReactNode } from 'react';
import TopBar from './TopBar';
import NavMenu from './NavMenu';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <TopBar />
      <NavMenu />
      <main className="flex-1 p-4">{children}</main>
      <footer className="bg-slate-800 text-white text-xs text-center py-2">
        4QT.COM® · RealBoost ERP Replica
      </footer>
    </div>
  );
}
```

- [ ] Update `src/pages/_app.tsx` to wrap authenticated pages in AppLayout:

```tsx
import { SessionProvider, useSession } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import AppLayout from '@/components/layout/AppLayout';
import '@/styles/globals.css';

const queryClient = new QueryClient();
const PUBLIC_PAGES = ['/login', '/403', '/tools/area-conversion', '/tools/emi-calculator', '/tools/my-ip'];

function AppContent({ Component, pageProps, router }: any) {
  const { status } = useSession();
  const isPublic = PUBLIC_PAGES.some(p => router.pathname.startsWith(p));
  if (isPublic) return <Component {...pageProps} />;
  if (status === 'loading') return <div className="flex items-center justify-center h-screen">Loading...</div>;
  return <AppLayout><Component {...pageProps} /></AppLayout>;
}

export default function App({ Component, pageProps: { session, ...pageProps }, router }: AppProps) {
  return (
    <SessionProvider session={session}>
      <QueryClientProvider client={queryClient}>
        <AppContent Component={Component} pageProps={pageProps} router={router} />
      </QueryClientProvider>
    </SessionProvider>
  );
}
```

- [ ] Create shared `src/components/shared/PageHeader.tsx`:

```tsx
interface Props { title: string; subtitle?: string; }
export default function PageHeader({ title, subtitle }: Props) {
  return (
    <div className="mb-4 pb-2 border-b">
      <h2 className="text-lg font-semibold text-slate-800">{title}</h2>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  );
}
```

- [ ] Create shared `src/components/shared/DataTable.tsx`:

```tsx
import { ReactNode } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Column<T> { header: string; accessor: keyof T | ((row: T) => ReactNode); }
interface Props<T> { columns: Column<T>[]; data: T[]; emptyMessage?: string; }

export default function DataTable<T extends { id: number | string }>({ columns, data, emptyMessage = 'No records found' }: Props<T>) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-700 hover:bg-slate-700">
            {columns.map(col => (
              <TableHead key={String(col.header)} className="text-white font-medium">{col.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length === 0 ? (
            <TableRow><TableCell colSpan={columns.length} className="text-center text-gray-500 py-8">{emptyMessage}</TableCell></TableRow>
          ) : data.map((row, i) => (
            <TableRow key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              {columns.map(col => (
                <TableCell key={String(col.header)}>
                  {typeof col.accessor === 'function' ? col.accessor(row) : String(row[col.accessor] ?? '')}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
```

- [ ] Run dev server — open `http://localhost:3000`, log in as admin/admin@123. Should see the nav bar and layout.

- [ ] Commit:

```bash
git add .
git commit -m "feat: add app layout with 7-module nav, topbar, and shared DataTable/PageHeader components"
```

---

## Task 6: Company Creation Page + API

**Files:**
- Create: `src/pages/api/master/company.ts`, `src/pages/master/company.tsx`

- [ ] Create `src/pages/api/master/company.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Company } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1).max(20),
  groupName: z.string().min(1).max(100),
  name: z.string().min(1).max(200),
  address1: z.string().min(1),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  pin: z.string().min(1),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email().optional().or(z.literal('')),
  website: z.string().optional(),
  cin: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  panNo: z.string().optional(),
  vatRegNo: z.string().optional(),
  payableAt: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);

  try {
    if (req.method === 'GET') {
      const companies = await Company.findAll({ order: [['name', 'ASC']] });
      return ok(res, companies);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      const company = await Company.create(parsed.data);
      return created(res, company, 'Company created successfully');
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      await Company.update(parsed.data, { where: { id } });
      const updated = await Company.findByPk(id);
      return ok(res, updated, 'Company updated successfully');
    }
    res.status(405).end();
  } catch (err) {
    return serverError(res, err);
  }
}
```

- [ ] Create `src/pages/master/company.tsx`:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  id: z.number().optional(),
  code: z.string().min(1, 'Code required'),
  groupName: z.string().min(1, 'Group name required'),
  name: z.string().min(1, 'Company name required'),
  address1: z.string().min(1, 'Address required'),
  address2: z.string().optional(),
  address3: z.string().optional(),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  country: z.string().min(1, 'Country required'),
  pin: z.string().min(1, 'PIN required'),
  phone: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
  cin: z.string().optional(),
  serviceTaxNo: z.string().optional(),
  panNo: z.string().optional(),
  vatRegNo: z.string().optional(),
  payableAt: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

function Field({ label, name, register, error, type = 'text' }: any) {
  return (
    <div className="flex flex-col gap-1">
      <Label>{label}</Label>
      <Input type={type} {...register(name)} />
      {error && <p className="text-red-500 text-xs">{error.message}</p>}
    </div>
  );
}

export default function CompanyPage() {
  const qc = useQueryClient();
  const { data: companies = [] } = useQuery({
    queryKey: ['company'],
    queryFn: () => axios.get('/api/master/company').then(r => r.data.data),
  });

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const saveMutation = useMutation({
    mutationFn: (data: FormData) =>
      data.id ? axios.put('/api/master/company', data) : axios.post('/api/master/company', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['company'] }); reset(); },
  });

  function onEdit(c: any) {
    Object.keys(c).forEach(k => setValue(k as any, c[k]));
  }

  return (
    <div>
      <PageHeader title="Company Creation" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">Company Details</h3>
          <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="grid grid-cols-2 gap-3">
            <Field label="Code *" name="code" register={register} error={errors.code} />
            <Field label="Group Name *" name="groupName" register={register} error={errors.groupName} />
            <div className="col-span-2"><Field label="Company Name *" name="name" register={register} error={errors.name} /></div>
            <div className="col-span-2"><Field label="Address Line 1 *" name="address1" register={register} error={errors.address1} /></div>
            <div className="col-span-2"><Field label="Address Line 2" name="address2" register={register} error={errors.address2} /></div>
            <Field label="City *" name="city" register={register} error={errors.city} />
            <Field label="State *" name="state" register={register} error={errors.state} />
            <Field label="Country *" name="country" register={register} error={errors.country} />
            <Field label="PIN *" name="pin" register={register} error={errors.pin} />
            <Field label="Phone" name="phone" register={register} error={errors.phone} />
            <Field label="Fax" name="fax" register={register} error={errors.fax} />
            <Field label="Email" name="email" type="email" register={register} error={errors.email} />
            <Field label="Website" name="website" register={register} error={errors.website} />
            <Field label="CIN" name="cin" register={register} error={errors.cin} />
            <Field label="Service Tax No." name="serviceTaxNo" register={register} error={errors.serviceTaxNo} />
            <Field label="PAN No." name="panNo" register={register} error={errors.panNo} />
            <Field label="VAT Reg. No." name="vatRegNo" register={register} error={errors.vatRegNo} />
            <Field label="Payable At" name="payableAt" register={register} error={errors.payableAt} />
            <div className="col-span-2 flex gap-2 pt-2">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={saveMutation.isPending}>
                {saveMutation.isPending ? 'Saving...' : 'Save'}
              </Button>
              <Button type="button" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <h3 className="font-semibold mb-4 text-slate-700">Companies</h3>
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-slate-700 text-white"><th className="p-2 text-left">Code</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">City</th><th className="p-2">Action</th></tr></thead>
            <tbody>{(companies as any[]).map((c, i) => (
              <tr key={c.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2">{c.code}</td>
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.city}</td>
                <td className="p-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => onEdit(c)}>Edit</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Run dev server. Navigate to `http://localhost:3000/master/company`. Create a company. Verify it appears in the list and in phpMyAdmin `companies` table.

- [ ] Commit:

```bash
git add .
git commit -m "feat: company creation page with GET/POST/PUT API"
```

---

## Task 7: Lookup Masters (Project Type, Area Type, Currency, Profession, Country, Banks)

These are all simple CRUD pages that follow the exact same pattern as Company but simpler (only id + name for most).

**Files:**
- Create: `src/pages/api/master/setup/project-type.ts` (and area-type, currency, profession, country, bank/company, bank/customer, bank/loan)
- Create: `src/pages/master/setup/project-type.tsx` (and the others)

- [ ] Create a reusable API handler factory `src/lib/simple-crud.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { ok, created, badRequest, unauthorized, serverError } from './api-response';
import { Model, ModelStatic } from 'sequelize';
import { z } from 'zod';

export function simpleCrudHandler(ModelClass: ModelStatic<any>, schema: z.ZodObject<any>) {
  return async function handler(req: NextApiRequest, res: NextApiResponse) {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return unauthorized(res);
    try {
      if (req.method === 'GET') {
        const records = await ModelClass.findAll({ order: [['name', 'ASC']] });
        return ok(res, records);
      }
      if (req.method === 'POST') {
        const parsed = schema.safeParse(req.body);
        if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
        const record = await ModelClass.create(parsed.data);
        return created(res, record);
      }
      if (req.method === 'PUT') {
        const { id, ...data } = req.body;
        const parsed = schema.safeParse(data);
        if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
        await ModelClass.update(parsed.data, { where: { id } });
        return ok(res, await ModelClass.findByPk(id));
      }
      if (req.method === 'DELETE') {
        const { id } = req.body;
        await ModelClass.destroy({ where: { id } });
        return ok(res, null, 'Deleted');
      }
      res.status(405).end();
    } catch (err) {
      return serverError(res, err);
    }
  };
}
```

- [ ] Create `src/pages/api/master/setup/project-type.ts`:

```typescript
import { ProjectType } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(ProjectType, z.object({ name: z.string().min(1) }));
```

- [ ] Repeat for: `area-type.ts` (AreaType), `currency.ts` (Currency — add symbol + exchangeRate fields to schema), `profession.ts` (Profession), `country.ts` (Country — add phoneCode field).

- [ ] Create `src/pages/api/master/setup/bank/company.ts`:

```typescript
import { BankCompany } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(BankCompany, z.object({
  bankName: z.string().min(1), accountNo: z.string().min(1),
  ifsc: z.string().min(1), branch: z.string().min(1), city: z.string().min(1),
}));
```

- [ ] Repeat for `bank/customer.ts` (BankCustomer) and `bank/loan.ts` (BankLoan).

- [ ] Create a reusable simple lookup page component `src/components/shared/SimpleLookupPage.tsx`:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import PageHeader from './PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Field { name: string; label: string; type?: string; }
interface Props { title: string; apiPath: string; fields: Field[]; schema: z.ZodObject<any>; }

export default function SimpleLookupPage({ title, apiPath, fields, schema }: Props) {
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: [apiPath], queryFn: () => axios.get(apiPath).then(r => r.data.data) });
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({ resolver: zodResolver(schema) });

  const save = useMutation({
    mutationFn: (d: any) => d.id ? axios.put(apiPath, d) : axios.post(apiPath, d),
    onSuccess: () => { qc.invalidateQueries({ queryKey: [apiPath] }); reset(); },
  });

  return (
    <div>
      <PageHeader title={title} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm">
          <form onSubmit={handleSubmit(d => save.mutate(d))} className="space-y-3">
            {fields.map(f => (
              <div key={f.name}>
                <Label>{f.label}</Label>
                <Input type={f.type || 'text'} {...register(f.name)} />
                {(errors as any)[f.name] && <p className="text-red-500 text-xs">{(errors as any)[f.name]?.message}</p>}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={save.isPending}>Save</Button>
              <Button type="button" variant="outline" onClick={() => reset()}>Clear</Button>
            </div>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-slate-700 text-white">
              {fields.map(f => <th key={f.name} className="p-2 text-left">{f.label}</th>)}
              <th className="p-2">Action</th>
            </tr></thead>
            <tbody>{(data as any[]).map((row, i) => (
              <tr key={row.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                {fields.map(f => <td key={f.name} className="p-2">{row[f.name]}</td>)}
                <td className="p-2 text-center">
                  <Button size="sm" variant="outline" onClick={() => { fields.forEach(f => setValue(f.name, row[f.name])); setValue('id', row.id); }}>Edit</Button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Create `src/pages/master/setup/project-type.tsx`:

```tsx
import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function ProjectTypePage() {
  return <SimpleLookupPage title="Project Type Creation" apiPath="/api/master/setup/project-type"
    fields={[{ name: 'name', label: 'Project Type Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Name required') })} />;
}
```

- [ ] Repeat same pattern for: `area-type.tsx`, `profession.tsx`, `country.tsx`.

- [ ] Run dev server. Test each lookup page — add, edit, confirm in phpMyAdmin.

- [ ] Commit:

```bash
git add .
git commit -m "feat: add lookup master pages (project-type, area-type, profession, currency, country, banks)"
```

---

## Task 8: Employee Module (Department + Employee CRUD + Create Login)

**Files:**
- Create: `src/pages/api/master/employee/department.ts`, `src/pages/api/master/employee/info.ts`, `src/pages/api/master/users.ts`, `src/pages/api/master/roles.ts`, `src/pages/api/master/role-menus.ts`
- Create: `src/pages/master/employee/department.tsx`, `src/pages/master/employee/info.tsx`, `src/pages/master/login/create.tsx`, `src/pages/master/roles/create.tsx`, `src/pages/master/roles/menus.tsx`

- [ ] Create `src/pages/api/master/employee/department.ts`:

```typescript
import { Department } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Department, z.object({ name: z.string().min(1, 'Department name required') }));
```

- [ ] Create `src/pages/master/employee/department.tsx`:

```tsx
import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function DepartmentPage() {
  return <SimpleLookupPage title="Department" apiPath="/api/master/employee/department"
    fields={[{ name: 'name', label: 'Department Name' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Required') })} />;
}
```

- [ ] Create `src/pages/api/master/employee/info.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Employee, Department } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import { z } from 'zod';

const schema = z.object({
  code: z.string().min(1), salutation: z.string().min(1),
  firstName: z.string().min(1), middleName: z.string().optional(),
  lastName: z.string().min(1), departmentId: z.number(),
  designation: z.string().optional(), mobile: z.string().min(10),
  email: z.string().email(), isAdmin: z.boolean().default(false),
  isTransfer: z.boolean().default(false),
  roleType: z.enum(['employee', 'call_center']).default('employee'),
  managerId: z.number().optional().nullable(),
  joiningDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const employees = await Employee.findAll({
        include: [{ model: Department }],
        order: [['firstName', 'ASC']],
      });
      return ok(res, employees);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      const emp = await Employee.create(parsed.data as any);
      return created(res, emp);
    }
    if (req.method === 'PUT') {
      const { id, ...data } = req.body;
      const parsed = schema.safeParse(data);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      await Employee.update(parsed.data as any, { where: { id } });
      return ok(res, await Employee.findByPk(id));
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
```

- [ ] Create `src/pages/api/master/roles.ts`:

```typescript
import { Role } from '@/models';
import { simpleCrudHandler } from '@/lib/simple-crud';
import { z } from 'zod';
export default simpleCrudHandler(Role, z.object({
  name: z.string().min(1), description: z.string().optional(),
}));
```

- [ ] Create `src/pages/api/master/role-menus.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Role, RoleMenu } from '@/models';
import { ok, created, unauthorized, serverError } from '@/lib/api-response';

// Full page list for role assignment UI
export const ALL_PAGES = [
  { url: '/master/company', name: 'Company Creation', category: 'Set Master' },
  { url: '/master/setup/project-type', name: 'Project Type', category: 'Set Master' },
  { url: '/master/setup/area-type', name: 'Area Type', category: 'Set Master' },
  { url: '/master/setup/currency', name: 'Currency', category: 'Set Master' },
  { url: '/master/setup/profession', name: 'Profession', category: 'Set Master' },
  { url: '/master/setup/bank/company', name: 'Company Bank', category: 'Set Master' },
  { url: '/master/setup/bank/customer', name: 'Customer Bank', category: 'Set Master' },
  { url: '/master/setup/bank/loan', name: 'Loan Bank', category: 'Set Master' },
  { url: '/master/employee/department', name: 'Department', category: 'Set Master' },
  { url: '/master/employee/info', name: 'Employee Info', category: 'Set Master' },
  { url: '/master/login/create', name: 'Create Login', category: 'Set Master' },
  { url: '/master/roles/create', name: 'Role Creation', category: 'Set Master' },
  { url: '/master/roles/menus', name: 'Role Wise Menus', category: 'Set Master' },
  // More pages will be added as each module is built
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const { roleId } = req.query;
      const assigned = await RoleMenu.findAll({ where: { roleId: Number(roleId) } });
      return ok(res, { allPages: ALL_PAGES, assigned });
    }
    if (req.method === 'POST') {
      const { roleId, pageUrls } = req.body;
      await RoleMenu.destroy({ where: { roleId } });
      const records = pageUrls.map((url: string) => {
        const page = ALL_PAGES.find(p => p.url === url)!;
        return { roleId, pageUrl: url, pageName: page.name, category: page.category, canView: true };
      });
      await RoleMenu.bulkCreate(records);
      return created(res, null, 'Menus assigned');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
```

- [ ] Create `src/pages/api/master/users.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User, Employee, Role } from '@/models';
import { ok, created, badRequest, unauthorized, serverError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const schema = z.object({
  employeeId: z.number(),
  username: z.string().min(3),
  password: z.string().min(6).optional(),
  roleId: z.number(),
  isActive: z.boolean().default(true),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    if (req.method === 'GET') {
      const users = await User.findAll({ include: [{ model: Employee }, { model: Role }] });
      return ok(res, users);
    }
    if (req.method === 'POST') {
      const parsed = schema.safeParse(req.body);
      if (!parsed.success) return badRequest(res, parsed.error.errors[0].message);
      const { password, ...data } = parsed.data;
      if (!password) return badRequest(res, 'Password required for new user');
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ ...data, passwordHash });
      return created(res, { ...user.toJSON(), passwordHash: undefined });
    }
    if (req.method === 'PUT') {
      const { id, password, ...data } = req.body;
      const updateData: any = { ...data };
      if (password) updateData.passwordHash = await bcrypt.hash(password, 12);
      await User.update(updateData, { where: { id } });
      return ok(res, null, 'User updated');
    }
    res.status(405).end();
  } catch (err) { return serverError(res, err); }
}
```

- [ ] Create `src/pages/master/roles/create.tsx`:

```tsx
import { z } from 'zod';
import SimpleLookupPage from '@/components/shared/SimpleLookupPage';
export default function RoleCreatePage() {
  return <SimpleLookupPage title="Role Creation" apiPath="/api/master/roles"
    fields={[{ name: 'name', label: 'Role Name' }, { name: 'description', label: 'Description' }]}
    schema={z.object({ id: z.number().optional(), name: z.string().min(1, 'Required'), description: z.string().optional() })} />;
}
```

- [ ] Create `src/pages/master/roles/menus.tsx`:

```tsx
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

export default function RoleMenusPage() {
  const qc = useQueryClient();
  const [roleId, setRoleId] = useState('');
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => axios.get('/api/master/roles').then(r => r.data.data) });
  const { data: menuData } = useQuery({
    queryKey: ['role-menus', roleId],
    queryFn: () => axios.get(`/api/master/role-menus?roleId=${roleId}`).then(r => r.data.data),
    enabled: !!roleId,
  });
  const [selected, setSelected] = useState<string[]>([]);

  const saveMutation = useMutation({
    mutationFn: () => axios.post('/api/master/role-menus', { roleId: Number(roleId), pageUrls: selected }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['role-menus', roleId] }),
  });

  function handleRoleChange(id: string) {
    setRoleId(id);
    setSelected(menuData?.assigned?.map((m: any) => m.pageUrl) ?? []);
  }

  const categories = [...new Set((menuData?.allPages ?? []).map((p: any) => p.category))];

  return (
    <div>
      <PageHeader title="Role Wise Menus" />
      <div className="bg-white p-4 rounded border shadow-sm">
        <div className="mb-4">
          <Label>Select Role</Label>
          <select className="border rounded px-3 py-2 ml-2" value={roleId} onChange={e => handleRoleChange(e.target.value)}>
            <option value="">--Select Role--</option>
            {(roles as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </div>
        {roleId && menuData && (
          <>
            {categories.map(cat => (
              <div key={cat} className="mb-4">
                <h4 className="font-semibold text-slate-700 mb-2 border-b pb-1">{cat}</h4>
                <div className="grid grid-cols-3 gap-2">
                  {menuData.allPages.filter((p: any) => p.category === cat).map((p: any) => (
                    <label key={p.url} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={selected.includes(p.url)}
                        onChange={e => setSelected(prev => e.target.checked ? [...prev, p.url] : prev.filter(u => u !== p.url))} />
                      {p.name}
                    </label>
                  ))}
                </div>
              </div>
            ))}
            <Button onClick={() => saveMutation.mutate()} className="bg-orange-500 hover:bg-orange-600">
              Save Menu Access
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] Create `src/pages/master/login/create.tsx`:

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const schema = z.object({
  employeeId: z.number({ required_error: 'Select employee' }),
  username: z.string().min(3, 'Min 3 chars'),
  password: z.string().min(6, 'Min 6 chars'),
  roleId: z.number({ required_error: 'Select role' }),
});
type FD = z.infer<typeof schema>;

export default function CreateLoginPage() {
  const qc = useQueryClient();
  const { data: employees = [] } = useQuery({ queryKey: ['employees'], queryFn: () => axios.get('/api/master/employee/info').then(r => r.data.data) });
  const { data: roles = [] } = useQuery({ queryKey: ['roles'], queryFn: () => axios.get('/api/master/roles').then(r => r.data.data) });
  const { data: users = [] } = useQuery({ queryKey: ['users'], queryFn: () => axios.get('/api/master/users').then(r => r.data.data) });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) });
  const save = useMutation({ mutationFn: (d: FD) => axios.post('/api/master/users', d), onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); reset(); } });

  return (
    <div>
      <PageHeader title="Create Employee Login" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded border shadow-sm space-y-3">
          <form onSubmit={handleSubmit(d => save.mutate({ ...d, employeeId: Number(d.employeeId), roleId: Number(d.roleId) }))}>
            <div><Label>Employee</Label>
              <select className="w-full border rounded px-3 py-2" {...register('employeeId', { valueAsNumber: true })}>
                <option value="">--Select--</option>
                {(employees as any[]).map((e: any) => <option key={e.id} value={e.id}>{e.firstName} {e.lastName} ({e.code})</option>)}
              </select>
              {errors.employeeId && <p className="text-red-500 text-xs">{errors.employeeId.message}</p>}
            </div>
            <div><Label>Username</Label><Input {...register('username')} />{errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}</div>
            <div><Label>Password</Label><Input type="password" {...register('password')} />{errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}</div>
            <div><Label>Role</Label>
              <select className="w-full border rounded px-3 py-2" {...register('roleId', { valueAsNumber: true })}>
                <option value="">--Select Role--</option>
                {(roles as any[]).map((r: any) => <option key={r.id} value={r.id}>{r.name}</option>)}
              </select>
              {errors.roleId && <p className="text-red-500 text-xs">{errors.roleId.message}</p>}
            </div>
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 mt-2" disabled={save.isPending}>Create Login</Button>
          </form>
        </div>
        <div className="bg-white p-4 rounded border shadow-sm">
          <table className="w-full text-sm"><thead><tr className="bg-slate-700 text-white"><th className="p-2 text-left">Employee</th><th className="p-2 text-left">Username</th><th className="p-2 text-left">Role</th><th className="p-2">Status</th></tr></thead>
            <tbody>{(users as any[]).map((u: any, i) => (
              <tr key={u.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="p-2">{u.Employee?.firstName} {u.Employee?.lastName}</td>
                <td className="p-2">{u.username}</td>
                <td className="p-2">{u.Role?.name}</td>
                <td className="p-2 text-center"><span className={`px-2 py-0.5 rounded text-xs ${u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
```

- [ ] Test the full auth flow:
  1. Create a "Sales" role at `/master/roles/create`
  2. Assign only `/master/company` to that role at `/master/roles/menus`
  3. Create an employee at `/master/employee/info`
  4. Create login for that employee with "Sales" role at `/master/login/create`
  5. Log out → log in as the new user → navigate to `/master/setup/project-type` → should redirect to `/403`
  6. Navigate to `/master/company` → should work

- [ ] Commit:

```bash
git add .
git commit -m "feat: employee, roles, and user login management with role-based access enforcement"
```

---

## Task 9: Remaining Master Pages (Security, Admin, Letterhead, Reminders)

**Files:**
- Create: `src/pages/master/security/password.tsx`, `src/pages/master/security/history.tsx`, `src/pages/master/admin/audit.tsx`

- [ ] Create `src/pages/api/master/security/change-password.ts`:

```typescript
import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { User } from '@/models';
import { ok, badRequest, unauthorized, serverError } from '@/lib/api-response';
import bcrypt from 'bcryptjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  const session = await getServerSession(req, res, authOptions);
  if (!session) return unauthorized(res);
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword || newPassword.length < 6) return badRequest(res, 'Invalid input');
    const user = await User.findOne({ where: { employeeId: (session.user as any).employeeId } });
    if (!user) return badRequest(res, 'User not found');
    const valid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!valid) return badRequest(res, 'Current password is incorrect');
    const hash = await bcrypt.hash(newPassword, 12);
    await user.update({ passwordHash: hash });
    return ok(res, null, 'Password changed successfully');
  } catch (err) { return serverError(res, err); }
}
```

- [ ] Create `src/pages/master/security/password.tsx`:

```tsx
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import PageHeader from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useState } from 'react';

const schema = z.object({
  currentPassword: z.string().min(1, 'Required'),
  newPassword: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string().min(6, 'Required'),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });
type FD = z.infer<typeof schema>;

export default function ChangePasswordPage() {
  const [msg, setMsg] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FD>({ resolver: zodResolver(schema) });
  const mutation = useMutation({
    mutationFn: (d: FD) => axios.post('/api/master/security/change-password', { currentPassword: d.currentPassword, newPassword: d.newPassword }),
    onSuccess: () => { setMsg('Password changed successfully'); reset(); },
    onError: (e: any) => setMsg(e.response?.data?.message || 'Error'),
  });
  return (
    <div>
      <PageHeader title="Change Password" />
      <div className="bg-white p-4 rounded border shadow-sm max-w-sm">
        <form onSubmit={handleSubmit(d => mutation.mutate(d))} className="space-y-3">
          <div><Label>Current Password</Label><Input type="password" {...register('currentPassword')} />{errors.currentPassword && <p className="text-red-500 text-xs">{errors.currentPassword.message}</p>}</div>
          <div><Label>New Password</Label><Input type="password" {...register('newPassword')} />{errors.newPassword && <p className="text-red-500 text-xs">{errors.newPassword.message}</p>}</div>
          <div><Label>Confirm Password</Label><Input type="password" {...register('confirmPassword')} />{errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}</div>
          {msg && <p className={`text-sm ${msg.includes('success') ? 'text-green-600' : 'text-red-500'}`}>{msg}</p>}
          <Button type="submit" className="bg-orange-500 hover:bg-orange-600" disabled={mutation.isPending}>Change Password</Button>
        </form>
      </div>
    </div>
  );
}
```

- [ ] Create placeholder pages (real content in later phases) for remaining master pages:

```tsx
// src/pages/master/security/history.tsx
import PageHeader from '@/components/shared/PageHeader';
export default function LoginHistoryPage() {
  return <div><PageHeader title="Login History" /><div className="bg-white p-4 rounded border">Login history records will appear here.</div></div>;
}

// src/pages/master/security/ip.tsx — same pattern, title "IP Security"
// src/pages/master/admin/audit.tsx — title "Customer Audit Track"
// src/pages/master/admin/receipt-lock.tsx — title "Receipt Locking"
// src/pages/master/admin/delete-customer.tsx — title "Delete Customer"
// src/pages/master/admin/delete-receipt.tsx — title "Delete Receipt"
// src/pages/master/setup/letterhead.tsx — title "Letter Head Format"
// src/pages/master/setup/reminders.tsx — title "Activity Reminders"
// src/pages/master/documents/type.tsx — title "Document Type Creation"
// src/pages/master/documents/dispatch-master.tsx — title "Document Dispatch Master"
// src/pages/master/letters/create.tsx — title "Create Letter"
// src/pages/master/employee/report.tsx — title "Employee Report"
// src/pages/master/employee/manager.tsx — title "Set Manager"
// src/pages/master/employee/team.tsx — title "Team Master"
// src/pages/master/employee/tree.tsx — title "Employee Tree"
// src/pages/master/login/view.tsx — title "View Login"
```

- [ ] Run dev server — navigate through all Set Master menu items. All pages should load (most showing placeholder content ready for Phase 2+).

- [ ] Commit:

```bash
git add .
git commit -m "feat: complete Set Master module — company, employees, roles, auth, security, admin pages"
```

---

## Task 10: Utility Tools (Public Pages — No Login Required)

**Files:**
- Create: `src/pages/tools/area-conversion.tsx`, `src/pages/tools/emi-calculator.tsx`, `src/pages/tools/my-ip.tsx`

- [ ] Create `src/pages/tools/area-conversion.tsx`:

```tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const CONVERSIONS: Record<string, number> = {
  sqft: 1, sqm: 10.7639, sqyd: 9, gaj: 9, bigha: 26909.8, acre: 43560,
};

export default function AreaConversionPage() {
  const [value, setValue] = useState('');
  const [from, setFrom] = useState('sqft');
  const num = parseFloat(value) || 0;
  const inSqft = num / CONVERSIONS[from];

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded border shadow-md w-full max-w-md">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Area Conversion</h2>
        <div className="flex gap-2 mb-4">
          <Input type="number" placeholder="Enter value" value={value} onChange={e => setValue(e.target.value)} />
          <select className="border rounded px-2" value={from} onChange={e => setFrom(e.target.value)}>
            {Object.keys(CONVERSIONS).map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <table className="w-full text-sm border-collapse">
          <thead><tr className="bg-slate-700 text-white"><th className="p-2 text-left">Unit</th><th className="p-2 text-right">Value</th></tr></thead>
          <tbody>{Object.entries(CONVERSIONS).map(([unit, factor], i) => (
            <tr key={unit} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-2 capitalize">{unit}</td>
              <td className="p-2 text-right">{(inSqft * factor).toFixed(4)}</td>
            </tr>
          ))}</tbody>
        </table>
      </div>
    </div>
  );
}
```

- [ ] Create `src/pages/tools/emi-calculator.tsx`:

```tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function EMICalculatorPage() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [tenure, setTenure] = useState('');
  const [emi, setEmi] = useState<number | null>(null);

  function calculate() {
    const P = parseFloat(principal), r = parseFloat(rate) / 12 / 100, n = parseFloat(tenure) * 12;
    if (!P || !r || !n) return;
    setEmi((P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-6 rounded border shadow-md w-full max-w-sm">
        <h2 className="text-lg font-bold text-slate-700 mb-4">EMI Calculator</h2>
        <div className="space-y-3">
          <div><Label>Loan Amount (₹)</Label><Input type="number" value={principal} onChange={e => setPrincipal(e.target.value)} /></div>
          <div><Label>Annual Interest Rate (%)</Label><Input type="number" value={rate} onChange={e => setRate(e.target.value)} /></div>
          <div><Label>Tenure (years)</Label><Input type="number" value={tenure} onChange={e => setTenure(e.target.value)} /></div>
          <Button onClick={calculate} className="w-full bg-orange-500 hover:bg-orange-600">Calculate EMI</Button>
          {emi !== null && (
            <div className="mt-4 text-center bg-orange-50 rounded p-4">
              <p className="text-sm text-gray-600">Monthly EMI</p>
              <p className="text-2xl font-bold text-orange-600">₹ {emi.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

- [ ] Create `src/pages/tools/my-ip.tsx`:

```tsx
import { useEffect, useState } from 'react';

export default function MyIPPage() {
  const [ip, setIp] = useState('Loading...');
  useEffect(() => { fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => setIp(d.ip)).catch(() => setIp('Could not detect')); }, []);
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded border shadow-md text-center">
        <h2 className="text-lg font-bold text-slate-700 mb-4">Your IP Address</h2>
        <p className="text-3xl font-mono text-orange-600">{ip}</p>
      </div>
    </div>
  );
}
```

- [ ] Test all three tools at `/tools/area-conversion`, `/tools/emi-calculator`, `/tools/my-ip` — all should work without login.

- [ ] Final Phase 1 commit:

```bash
git add .
git commit -m "feat: add public utility tools (area conversion, EMI calculator, IP checker)"
```

---

## Phase 1 Complete ✓

At this point you have:
- ✅ Next.js 14 Pages Router project with TypeScript + Tailwind + shadcn/ui
- ✅ MySQL connected via Sequelize — all 18 master tables created
- ✅ NextAuth.js auth with bcrypt — login page matching original ERP
- ✅ Role-based route protection via middleware
- ✅ Full 7-module nav matching the original ERP layout
- ✅ Complete Set Master module (Company, Employees, Departments, Roles, Users, Banks, Lookups, Security)
- ✅ 3 public utility tools (Area Conversion, EMI Calculator, IP Check)

**Next: Phase 2 — Set Projects module** (Projects, Towers, Floors, Units, Payment Plans, Rates)
