# 🌐 HTTP Access Guide - Energy Saver Costa Rica

## 🚀 Quick Start - Get Your HTTP URL

### Option 1: Simple Python Server (Recommended)
```bash
# In the project directory, run:
python3 start_server.py

# Or use the quick start scripts:
./start.sh          # Linux/Mac
start.bat           # Windows
```

**Your HTTP URLs will be:**
- 🏠 **Main Interface**: http://localhost:8000/index.html
- 📊 **Dashboard**: http://localhost:8000/dashboard.html  
- 🎁 **Referrals**: http://localhost:8000/referrals-dashboard.html

### Option 2: Manual Python Server
```bash
cd /path/to/analizador-recibos-v2
python3 -m http.server 8000
```

### Option 3: Node.js Server (Alternative)
```bash
npx http-server -p 8000 -c-1
```

## 📱 Access Your Interface

Once the server is running, open your browser and navigate to:
**http://localhost:8000/index.html**

## 🔧 Default Login Credentials

As documented in the README:
- **Email**: mariosavardenergysaver@gmail.com
- **Password**: mario123

## 🌍 Live Production URL

The system is also available online at:
**https://marioenergy.github.io/analizador-recibos-v2/**

## 📋 Available Features

✅ **Complete Energy Analysis System**
✅ **WhatsApp OTP Verification** 
✅ **Document Generation (PAGARÉ)**
✅ **Real-time Health Monitoring**
✅ **Referral System Dashboard**
✅ **OCR Receipt Processing**

## 🔄 Stopping the Server

Press `Ctrl+C` in the terminal to stop the HTTP server.

## 🆘 Troubleshooting

### Port Already in Use
If port 8000 is busy, try a different port:
```bash
python3 start_server.py 8080
```

### CSS Not Loading
The system uses TailwindCSS CDN. If styling looks broken:
1. Check your internet connection
2. Try disabling ad blockers
3. Use the production URL instead

### Module Import Errors
Ensure you're running the server from the project root directory where `index.html` is located.

---

**🚀 Your Energy Saver Costa Rica system is now accessible via HTTP!**