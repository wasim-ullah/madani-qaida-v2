import {
  pgTable, text, timestamp, integer, boolean, pgEnum,
} from 'drizzle-orm/pg-core';

// ── Enums ─────────────────────────────────────────────────────────────────────
export const roleEnum = pgEnum('role', ['student', 'teacher', 'admin']);
export const subStatusEnum = pgEnum('subscription_status', [
  'active', 'trialing', 'past_due', 'canceled', 'incomplete',
]);
export const overrideStatusEnum = pgEnum('override_status', ['granted', 'revoked']);
export const markStateEnum = pgEnum('mark_state', [
  'unmarked', 'needs-practice', 'review-later', 'mastered',
]);
export const itemTypeEnum = pgEnum('item_type', ['letter', 'word', 'ayah']);

// ── Users ─────────────────────────────────────────────────────────────────────
// clerk_id is the Clerk userId — primary key for our records.
export const users = pgTable('users', {
  id:               text('id').primaryKey(),               // = Clerk userId
  email:            text('email').notNull().unique(),
  name:             text('name'),
  role:             roleEnum('role').notNull().default('student'),
  stripeCustomerId: text('stripe_customer_id'),
  createdAt:        timestamp('created_at').defaultNow().notNull(),
  updatedAt:        timestamp('updated_at').defaultNow().notNull(),
});

// ── Subscriptions ─────────────────────────────────────────────────────────────
export const subscriptions = pgTable('subscriptions', {
  id:                   text('id').primaryKey(),            // = stripe subscription id
  userId:               text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  stripeSubscriptionId: text('stripe_subscription_id').notNull().unique(),
  stripePriceId:        text('stripe_price_id').notNull(),
  status:               subStatusEnum('status').notNull(),
  currentPeriodEnd:     timestamp('current_period_end').notNull(),
  createdAt:            timestamp('created_at').defaultNow().notNull(),
  updatedAt:            timestamp('updated_at').defaultNow().notNull(),
});

// ── Access Overrides ──────────────────────────────────────────────────────────
// null override_status means "no override — fall through to Stripe"
export const accessOverrides = pgTable('access_overrides', {
  id:             integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId:         text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  overrideStatus: overrideStatusEnum('override_status'),   // null = no override
  reason:         text('reason'),
  setByAdminId:   text('set_by_admin_id').references(() => users.id),
  createdAt:      timestamp('created_at').defaultNow().notNull(),
  updatedAt:      timestamp('updated_at').defaultNow().notNull(),
});

// ── Access Audit Log ──────────────────────────────────────────────────────────
export const accessAuditLog = pgTable('access_audit_log', {
  id:           integer('id').primaryKey().generatedAlwaysAsIdentity(),
  targetUserId: text('target_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  adminId:      text('admin_id').notNull().references(() => users.id),
  previousStatus: overrideStatusEnum('previous_status'),
  newStatus:    overrideStatusEnum('new_status'),
  reason:       text('reason'),
  createdAt:    timestamp('created_at').defaultNow().notNull(),
});

// ── Progress ──────────────────────────────────────────────────────────────────
export const progress = pgTable('progress', {
  id:          integer('id').primaryKey().generatedAlwaysAsIdentity(),
  userId:      text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  lessonId:    text('lesson_id').notNull(),
  starsEarned: integer('stars_earned').notNull().default(0),
  completed:   boolean('completed').notNull().default(false),
  completedAt: timestamp('completed_at'),
  createdAt:   timestamp('created_at').defaultNow().notNull(),
  updatedAt:   timestamp('updated_at').defaultNow().notNull(),
});

// ── Teacher Marks ─────────────────────────────────────────────────────────────
export const teacherMarks = pgTable('teacher_marks', {
  id:            integer('id').primaryKey().generatedAlwaysAsIdentity(),
  teacherUserId: text('teacher_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  itemId:        text('item_id').notNull(),
  itemType:      itemTypeEnum('item_type').notNull().default('letter'),
  markState:     markStateEnum('mark_state').notNull().default('unmarked'),
  note:          text('note'),
  createdAt:     timestamp('created_at').defaultNow().notNull(),
  updatedAt:     timestamp('updated_at').defaultNow().notNull(),
});

// ── Types ─────────────────────────────────────────────────────────────────────
export type User         = typeof users.$inferSelect;
export type Subscription = typeof subscriptions.$inferSelect;
export type AccessOverride = typeof accessOverrides.$inferSelect;
export type Progress     = typeof progress.$inferSelect;
export type TeacherMark  = typeof teacherMarks.$inferSelect;
