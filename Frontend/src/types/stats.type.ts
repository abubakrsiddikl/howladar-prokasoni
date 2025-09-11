


export interface StatusStat {
  status: string
  count: number
}

export interface IStats {
  totalOrders: number
  totalUsers: number
  totalBook: number
  statusStats: StatusStat[]
}





export interface IMonthlyStats {
  year: number;
  month: string;
  totalOrders: number;
  totalRevenue: number;
}