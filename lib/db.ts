import mysql from "mysql2/promise"

// Database connection configuration
const dbConfig = {
  host: process.env.MYSQL_HOST || "localhost",
  port: parseInt(process.env.MYSQL_PORT || "3306"),
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASSWORD || "",
  database: process.env.MYSQL_DATABASE || "luxury_services",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}

// Create connection pool
const pool = mysql.createPool(dbConfig)

export { pool }

// Helper function for executing queries
export async function query<T>(sql: string, params?: unknown[]): Promise<T> {
  const [results] = await pool.execute(sql, params)
  return results as T
}

// User types
export interface User {
  id: number
  username: string
  email: string
  password: string
  role: "user" | "admin" | "super_admin"
  status: "inactive" | "active" | "expired" | "banned"
  created_at: Date
  updated_at: Date
}

export interface Plan {
  id: number
  name: string
  price: number
  duration_days: number
  description: string
  features: string[]
  is_active: boolean
  created_at: Date
}

export interface SerialKey {
  id: number
  serial_key: string
  plan_id: number
  status: "available" | "used" | "expired" | "revoked"
  used_by: number | null
  used_at: Date | null
  created_by: number | null
  created_at: Date
}

export interface Subscription {
  id: number
  user_id: number
  plan_id: number
  serial_key_id: number | null
  activated_at: Date
  expires_at: Date
  status: "active" | "expired" | "cancelled"
  is_trial: boolean
}

export interface SystemSetting {
  id: number
  setting_key: string
  setting_value: string
  description: string
  updated_at: Date
}

// User functions
export async function createUser(username: string, email: string, hashedPassword: string): Promise<number> {
  const result = await query<mysql.ResultSetHeader>(
    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashedPassword]
  )
  return result.insertId
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const users = await query<User[]>(
    "SELECT * FROM users WHERE email = ? LIMIT 1",
    [email]
  )
  return users[0] || null
}

export async function findUserByUsername(username: string): Promise<User | null> {
  const users = await query<User[]>(
    "SELECT * FROM users WHERE username = ? LIMIT 1",
    [username]
  )
  return users[0] || null
}

export async function findUserById(id: number): Promise<User | null> {
  const users = await query<User[]>(
    "SELECT * FROM users WHERE id = ? LIMIT 1",
    [id]
  )
  return users[0] || null
}

export async function updateUserStatus(userId: number, status: User["status"]): Promise<void> {
  await query(
    "UPDATE users SET status = ? WHERE id = ?",
    [status, userId]
  )
}

export async function updateUserRole(userId: number, role: User["role"]): Promise<void> {
  await query(
    "UPDATE users SET role = ? WHERE id = ?",
    [role, userId]
  )
}

export async function getAllUsers(): Promise<User[]> {
  return query<User[]>(
    "SELECT id, username, email, role, status, created_at, updated_at FROM users ORDER BY created_at DESC"
  )
}

export async function deleteUser(userId: number): Promise<void> {
  await query("DELETE FROM users WHERE id = ?", [userId])
}

// Serial key functions
export async function findSerialKey(serialKey: string): Promise<(SerialKey & { plan_name: string; duration_days: number }) | null> {
  const keys = await query<(SerialKey & { plan_name: string; duration_days: number })[]>(
    `SELECT sk.*, p.name as plan_name, p.duration_days 
     FROM serial_keys sk 
     JOIN plans p ON sk.plan_id = p.id 
     WHERE sk.serial_key = ? LIMIT 1`,
    [serialKey]
  )
  return keys[0] || null
}

export async function useSerialKey(serialKeyId: number, userId: number): Promise<void> {
  await query(
    "UPDATE serial_keys SET status = 'used', used_by = ?, used_at = NOW() WHERE id = ?",
    [userId, serialKeyId]
  )
}

export async function getAllSerialKeys(): Promise<(SerialKey & { plan_name: string; used_by_username?: string })[]> {
  return query<(SerialKey & { plan_name: string; used_by_username?: string })[]>(
    `SELECT sk.*, p.name as plan_name, u.username as used_by_username 
     FROM serial_keys sk 
     JOIN plans p ON sk.plan_id = p.id 
     LEFT JOIN users u ON sk.used_by = u.id 
     ORDER BY sk.created_at DESC`
  )
}

export async function createSerialKey(serialKey: string, planId: number, createdBy?: number): Promise<number> {
  const result = await query<mysql.ResultSetHeader>(
    "INSERT INTO serial_keys (serial_key, plan_id, created_by) VALUES (?, ?, ?)",
    [serialKey, planId, createdBy || null]
  )
  return result.insertId
}

export async function revokeSerialKey(serialKeyId: number): Promise<void> {
  await query(
    "UPDATE serial_keys SET status = 'revoked' WHERE id = ?",
    [serialKeyId]
  )
}

// Subscription functions
export async function createSubscription(userId: number, planId: number, serialKeyId: number | null, durationDays: number, isTrial: boolean = false): Promise<number> {
  const result = await query<mysql.ResultSetHeader>(
    `INSERT INTO subscriptions (user_id, plan_id, serial_key_id, expires_at, is_trial) 
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY), ?)`,
    [userId, planId, serialKeyId, durationDays, isTrial]
  )
  return result.insertId
}

export async function getActiveSubscription(userId: number): Promise<(Subscription & { plan_name: string }) | null> {
  const subs = await query<(Subscription & { plan_name: string })[]>(
    `SELECT s.*, p.name as plan_name 
     FROM subscriptions s 
     JOIN plans p ON s.plan_id = p.id 
     WHERE s.user_id = ? AND s.status = 'active' AND s.expires_at > NOW() 
     ORDER BY s.expires_at DESC LIMIT 1`,
    [userId]
  )
  return subs[0] || null
}

export async function getAllSubscriptions(): Promise<(Subscription & { plan_name: string; username: string; email: string })[]> {
  return query<(Subscription & { plan_name: string; username: string; email: string })[]>(
    `SELECT s.*, p.name as plan_name, u.username, u.email 
     FROM subscriptions s 
     JOIN plans p ON s.plan_id = p.id 
     JOIN users u ON s.user_id = u.id 
     ORDER BY s.activated_at DESC`
  )
}

export async function cancelSubscription(subscriptionId: number): Promise<void> {
  await query(
    "UPDATE subscriptions SET status = 'cancelled' WHERE id = ?",
    [subscriptionId]
  )
}

export async function extendSubscription(subscriptionId: number, days: number): Promise<void> {
  await query(
    "UPDATE subscriptions SET expires_at = DATE_ADD(expires_at, INTERVAL ? DAY) WHERE id = ?",
    [days, subscriptionId]
  )
}

// Plan functions
export async function getActivePlans(): Promise<Plan[]> {
  return query<Plan[]>(
    "SELECT * FROM plans WHERE is_active = TRUE ORDER BY price ASC"
  )
}

export async function getAllPlans(): Promise<Plan[]> {
  return query<Plan[]>(
    "SELECT * FROM plans ORDER BY price ASC"
  )
}

export async function getTrialPlan(): Promise<Plan | null> {
  const plans = await query<Plan[]>(
    "SELECT * FROM plans WHERE name = 'Trial' AND is_active = TRUE LIMIT 1"
  )
  return plans[0] || null
}

// System settings functions
export async function getSetting(key: string): Promise<string | null> {
  const settings = await query<SystemSetting[]>(
    "SELECT * FROM system_settings WHERE setting_key = ? LIMIT 1",
    [key]
  )
  return settings[0]?.setting_value || null
}

export async function updateSetting(key: string, value: string): Promise<void> {
  await query(
    "UPDATE system_settings SET setting_value = ? WHERE setting_key = ?",
    [value, key]
  )
}

export async function getAllSettings(): Promise<SystemSetting[]> {
  return query<SystemSetting[]>(
    "SELECT * FROM system_settings ORDER BY setting_key"
  )
}

// Generate serial key
export function generateSerialKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  const segments = []
  for (let i = 0; i < 5; i++) {
    let segment = ""
    for (let j = 0; j < 4; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    segments.push(segment)
  }
  return segments.join("-")
}

// Dashboard stats
export async function getDashboardStats(): Promise<{
  totalUsers: number
  activeUsers: number
  totalSubscriptions: number
  activeSubscriptions: number
  totalSerialKeys: number
  availableSerialKeys: number
}> {
  const [users, activeUsers, subs, activeSubs, keys, availableKeys] = await Promise.all([
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM users"),
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM users WHERE status = 'active'"),
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM subscriptions"),
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM subscriptions WHERE status = 'active' AND expires_at > NOW()"),
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM serial_keys"),
    query<[{ count: number }]>("SELECT COUNT(*) as count FROM serial_keys WHERE status = 'available'"),
  ])

  return {
    totalUsers: users[0].count,
    activeUsers: activeUsers[0].count,
    totalSubscriptions: subs[0].count,
    activeSubscriptions: activeSubs[0].count,
    totalSerialKeys: keys[0].count,
    availableSerialKeys: availableKeys[0].count,
  }
}
