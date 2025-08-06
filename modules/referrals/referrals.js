// Sistema de Referidos - Energy Saver Costa Rica
const ReferralsModule = {
    // Generar código único de referido
    generateReferralCode(name) {
        const prefix = name.substring(0, 3).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `${prefix}-${random}`;
    },
    
    // Guardar nuevo referido
    saveReferral(referralData) {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        referrals.push({
            id: Date.now(),
            timestamp: new Date().toISOString(),
            ...referralData
        });
        localStorage.setItem('referrals', JSON.stringify(referrals));
        return true;
    },
    
    // Obtener referidos de un cliente
    getReferralsByClient(clientPhone) {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        return referrals.filter(r => r.referrerPhone === clientPhone);
    },
    
    // Obtener estadísticas
    getReferralStats() {
        const referrals = JSON.parse(localStorage.getItem('referrals') || '[]');
        const analyses = JSON.parse(localStorage.getItem('energySaverAnalyses') || '[]');
        
        // Agrupar por referidor
        const stats = {};
        referrals.forEach(referral => {
            if (!stats[referral.referrerPhone]) {
                stats[referral.referrerPhone] = {
                    name: referral.referrerName,
                    phone: referral.referrerPhone,
                    code: referral.referralCode,
                    totalReferrals: 0,
                    activeReferrals: 0
                };
            }
            stats[referral.referrerPhone].totalReferrals++;
            
            // Verificar si el referido hizo análisis
            const hasAnalysis = analyses.some(a => 
                a.telefono === referral.referredPhone
            );
            if (hasAnalysis) {
                stats[referral.referrerPhone].activeReferrals++;
            }
        });
        
        return Object.values(stats);
    }
};

export default ReferralsModule;
        // Agrupar por referidor
        const stats = {};
        referrals.forEach(referral => {
            if (!stats[referral.referrerPhone]) {
                stats[referral.referrerPhone] = {
                    name: referral.referrerName,
                    phone: referral.referrerPhone,
                    code: referral.referralCode,
                    totalReferrals: 0,
                    activeReferrals: 0
                };
            }
            stats[referral.referrerPhone].totalReferrals++;
            
            // Verificar si el referido hizo análisis
            const hasAnalysis = analyses.some(a => 
                a.telefono === referral.referredPhone
            );
            if (hasAnalysis) {
                stats[referral.referrerPhone].activeReferrals++;
            }
        });
        
        return Object.values(stats);
    }
};

export default ReferralsModule;
