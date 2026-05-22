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
  created_at: Date
}

export interface Subscription {
  id: number
  user_id: number
  plan_id: number
  serial_key_id: number
  activated_at: Date
  expires_at: Date
  status: "active" | "expired" | "cancelled"
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

// Subscription functions
export async function createSubscription(userId: number, planId: number, serialKeyId: number, durationDays: number): Promise<number> {
  const result = await query<mysql.ResultSetHeader>(
    `INSERT INTO subscriptions (user_id, plan_id, serial_key_id, expires_at) 
     VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL ? DAY))`,
    [userId, planId, serialKeyId, durationDays]
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

// Plan functions
export async function getActivePlans(): Promise<Plan[]> {
  return query<Plan[]>(
    "SELECT * FROM plans WHERE is_active = TRUE ORDER BY price ASC"
  )
}
