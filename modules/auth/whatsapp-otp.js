// Sistema OTP Simple para WhatsApp
const WhatsAppOTP = {
    currentPhone: null,
    
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

// Funciones globales para HTML
window.requestOTP = function() {
    const phoneInput = document.getElementById('phone-number');
    const phone = phoneInput.value.trim().replace(/\D/g, '');
    
    if (!phone || phone.length < 8) {
        document.getElementById('otp-error').textContent = 'Número de teléfono inválido';
        document.getElementById('otp-error').classList.remove('hidden');
        return;
    }
    
    // Generar OTP
    const otp = WhatsAppOTP.generateOTP();
    WhatsAppOTP.currentPhone = phone;
    WhatsAppOTP.storeOTP(phone, otp);
    
    // Simular envío (en realidad solo lo guardamos)
    console.log(`📱 OTP generado para ${phone}: ${otp}`);
    
    // Mostrar paso 2
    document.getElementById('otp-step-1').classList.add('hidden');
    document.getElementById('otp-step-2').classList.remove('hidden');
    document.getElementById('otp-error').classList.add('hidden');
    
    // Para testing: mostrar el código en consola
    alert(`🔐 Código de prueba: ${otp}\n(En producción se enviaría por WhatsApp)`);
};

window.verifyOTP = function() {
    const otpInput = document.getElementById('otp-code');
    const code = otpInput.value.trim();
    
    if (!code || code.length !== 6) {
        document.getElementById('otp-error').textContent = 'Código debe tener 6 dígitos';
        document.getElementById('otp-error').classList.remove('hidden');
        return;
    }
    
    if (WhatsAppOTP.verifyOTP(WhatsAppOTP.currentPhone, code)) {
        // OTP correcto - continuar al dashboard
        document.getElementById('otp-screen').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        
        // Simular usuario autenticado
        const user = {
            id: 1,
            name: 'Usuario Verificado',
            phone: WhatsAppOTP.currentPhone,
            role: 'user',
            loginTime: new Date().toISOString()
        };
        localStorage.setItem('energySaverUser', JSON.stringify(user));
        
        // Actualizar info usuario
        const userNameElement = document.getElementById('user-name');
        const userRoleElement = document.getElementById('user-role');
        if (userNameElement) userNameElement.textContent = user.name;
        if (userRoleElement) userRoleElement.textContent = user.role;
        
        console.log('✅ OTP verificado exitosamente');
    } else {
        document.getElementById('otp-error').textContent = 'Código incorrecto o expirado';
        document.getElementById('otp-error').classList.remove('hidden');
    }
};

export default WhatsAppOTP;
