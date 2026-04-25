export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
}
export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  PROPERTY_OWNER = 'PROPERTY_OWNER',
  GENERAL_MANAGER = 'GENERAL_MANAGER',
  FRONT_DESK_MANAGER = 'FRONT_DESK_MANAGER',
  RECEPTIONIST = 'RECEPTIONIST',
  HOUSEKEEPING_MANAGER = 'HOUSEKEEPING_MANAGER',
  HOUSEKEEPING_STAFF = 'HOUSEKEEPING_STAFF',
  ACCOUNTANT = 'ACCOUNTANT',
  POS_MANAGER = 'POS_MANAGER',
  MAINTENANCE_STAFF = 'MAINTENANCE_STAFF',
  HR_MANAGER = 'HR_MANAGER',
  GUEST_USER = 'GUEST_USER',
}

export enum ResourceType {
  // Core
  PROPERTY = 'property',
  USER = 'user',
  ROLE = 'role',
  AUDIT_LOG = 'audit_log',

  // Room & Accommodation
  ROOM = 'room',
  ROOM_TYPE = 'room_type',
  ROOM_RATE = 'room_rate',

  // Booking & Front Office
  BOOKING = 'booking',
  CHECK_IN = 'check_in',
  CHECK_OUT = 'check_out',
  GUEST = 'guest',
  GUEST_LOYALTY = 'guest_loyalty',

  // Operations
  HOUSEKEEPING = 'housekeeping',
  LOST_AND_FOUND = 'lost_and_found',
  MAINTENANCE = 'maintenance',
  ASSET = 'asset',

  // Finance
  INVOICE = 'invoice',
  PAYMENT = 'payment',
  FOLIO = 'folio',
  REFUND = 'refund',

  // POS
  POS_ORDER = 'pos_order',
  POS_MENU = 'pos_menu',
  MINI_BAR = 'mini_bar',

  // Inventory & HR
  INVENTORY = 'inventory',
  VENDOR = 'vendor',
  STAFF = 'staff',
  SHIFT = 'shift',
  ATTENDANCE = 'attendance',
  LEAVE = 'leave',
  PAYROLL = 'payroll',

  // Reporting
  REPORT = 'report',
  ANALYTICS = 'analytics',
}

export enum ActionType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  APPROVE = 'approve', // e.g. approve bookings, leave requests
  REJECT = 'reject',
  ASSIGN = 'assign', // e.g. assign rooms, assign tasks
  EXPORT = 'export', // reports, invoices
  PRINT = 'print',
  CHECKIN = 'checkin',
  CHECKOUT = 'checkout',
  CANCEL = 'cancel',
}

// Controls WHERE the permission applies
export enum PermissionScope {
  GLOBAL = 'global', // Super Admin — all properties
  CHAIN = 'chain', // Head office across chain
  PROPERTY = 'property', // A single property
  SHIFT = 'shift', // Only during assigned shift
  SELF = 'self', // Own data only (e.g. own attendance)
}
