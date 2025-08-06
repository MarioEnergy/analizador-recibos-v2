// Sistema OTP Simple para WhatsApp
const WhatsAppOTP = {
    // Generar código OTP
    generateOTP: () => {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },
    
    // Crear mensaje para WhatsApp
    createOTPMessage: (phone, otp) => {
        const message = `🔐 Energy Saver Costa Rica\n\nTu código de verificación es: ${otp}\n\nVálido por 10 minutos.`;
        const whatsappAdmin = '50687226666'; // Tu WhatsApp
        const url = `https://wa.me/${whatsappAdmin}?text=${encodeURIComponent(`Cliente ${phone} solicita OTP: ${otp}`)}`;
        return { message, url, otp };
    },
    
    // Almacenar OTP temporalmente
    storeOTP: (phone, otp) => {
        const expiry = Date.now() + (10 * 60 * 1000); // 10 minutos
        sessionStorage.setItem(`otp_${phone}`, JSON.stringify({ otp, expiry }));
    },
    
    // Verificar OTP
    verifyOTP: (phone, inputOTP) => {
        const stored = sessionStorage.getItem(`otp_${phone}`);
        if (!stored) return false;
        
        const { otp, expiry } = JSON.parse(stored);
        if (Date.now() > expiry) {
            sessionStorage.removeItem(`otp_${phone}`);
            return false;
        }
        
        return otp === inputOTP;
    }
};
