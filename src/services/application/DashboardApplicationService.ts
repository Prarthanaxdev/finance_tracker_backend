import { AnalyticsDomainService } from '../domain/AnalyticsDomainService';

export class DashboardApplicationService {
  private analyticsDomainService: AnalyticsDomainService;

  constructor() {
    this.analyticsDomainService = new AnalyticsDomainService();
  }

  /**
   * Gets monthly summary for dashboard
   */
  async getMonthlySummary(userId: string) {
    return await this.analyticsDomainService.getMonthlySummary(userId);
  }

  /**
   * Gets monthly trends for a specific year
   */
  async getMonthlyTrends(userId: string, year: number) {
    return await this.analyticsDomainService.getMonthlyTrends(userId, year);
  }

  /**
   * Gets category breakdown for current month
   */
  async getCategoryBreakdown(userId: string) {
    return await this.analyticsDomainService.getCategoryBreakdown(userId);
  }
}
