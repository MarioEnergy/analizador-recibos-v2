// HealthMonitor - Sistema di Monitoring Modulare
class HealthMonitor {
    constructor() {
        this.moduleStats = {};
        this.systemHealth = "UNKNOWN";
        this.errorLog = [];
        this.performanceMetrics = {};
        this.startTime = Date.now();
    }


    // Initialize module monitoring
    initModule(moduleName) {
        this.moduleStats[moduleName] = {
            status: 'INITIALIZING',
            startTime: Date.now(),
            errors: 0,
            operations: 0,
            lastActivity: Date.now(),
            performance: {
                avgResponseTime: 0,
                totalRequests: 0,
                errorRate: 0
            }
        };
        console.log(`🔍 [HEALTH] Module ${moduleName} initialized`);
    }

    // Set module status
    setModuleStatus(moduleName, status) {
        if (this.moduleStats[moduleName]) {
            this.moduleStats[moduleName].status = status;
            this.moduleStats[moduleName].lastActivity = Date.now();
            console.log(`📊 [HEALTH] ${moduleName}: ${status}`);
        }
    }

    // Log module error
    logError(moduleName, error, context = {}) {
        const errorEntry = {
            module: moduleName,
            error: error.message || error,
            timestamp: new Date().toISOString(),
            context: context
        };
        
        this.errorLog.push(errorEntry);
        if (this.moduleStats[moduleName]) {
            this.moduleStats[moduleName].errors++;
        }
        
        console.error(`🚨 [ERROR] ${moduleName}:`, error);
    }

    // Track module performance
    trackOperation(moduleName, operationName, duration) {
        if (!this.moduleStats[moduleName]) return;
        
        const stats = this.moduleStats[moduleName];
        stats.operations++;
        stats.lastActivity = Date.now();
        
        // Update performance metrics
        const perf = stats.performance;
        perf.totalRequests++;
        perf.avgResponseTime = ((perf.avgResponseTime * (perf.totalRequests - 1)) + duration) / perf.totalRequests;
        perf.errorRate = (stats.errors / perf.totalRequests) * 100;
        
        console.log(`⚡ [PERF] ${moduleName}.${operationName}: ${duration}ms`);
    }

    // Get system health overview
    getSystemHealth() {
        let healthyModules = 0;
        let totalModules = Object.keys(this.moduleStats).length;
        
        for (const [moduleName, stats] of Object.entries(this.moduleStats)) {
            if (stats.status === 'HEALTHY' || stats.status === 'READY') {
                healthyModules++;
            }
        }
        
        const healthPercentage = totalModules > 0 ? (healthyModules / totalModules) * 100 : 0;
        
        if (healthPercentage >= 80) this.systemHealth = 'HEALTHY';
        else if (healthPercentage >= 50) this.systemHealth = 'WARNING';
        else this.systemHealth = 'CRITICAL';
        
        return {
            status: this.systemHealth,
            healthPercentage: healthPercentage,
            totalModules: totalModules,
            healthyModules: healthyModules,
            uptime: Date.now() - this.startTime
        };
    }

    // Generate detailed health report
    generateHealthReport() {
        const systemHealth = this.getSystemHealth();
        const report = {
            timestamp: new Date().toISOString(),
            system: systemHealth,
            modules: this.moduleStats,
            recentErrors: this.errorLog.slice(-10),
            performance: this.performanceMetrics
        };
        
        console.log('📋 [HEALTH REPORT]', report);
        return report;
    }
}

export default HealthMonitor;
