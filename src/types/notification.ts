export type AlertSeverity = "info" | "warning" | "critical" | "emergency";
export type NotificationCategory = "shortage" | "delivery" | "maintenance" | "system";

export interface Notification {
  id: string;
  user_id?: string;
  title: string;
  body: string;
  severity: AlertSeverity;
  category: NotificationCategory;
  reference_type?: string;
  reference_id?: string;
  is_read: boolean;
  read_at?: string;
  created_at: string;
}
