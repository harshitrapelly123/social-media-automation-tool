
import AnalyticsDashboard from "@/components/app/analytics-dashboard";

export default function AnalyticsPage() {
    return (
        <div className="mt-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Post Analytics</h1>
                <p className="text-muted-foreground">Detailed engagement metrics for your published posts.</p>
            </div>
            <AnalyticsDashboard />
        </div>
    );
}
