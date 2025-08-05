        // CONFIGURAZIONE ENERGY SAVER
        const CONFIG = {
            company: {
                name: 'ENERGY SAVER, SOCIEDAD ANÓNIMA',
                cedula: '3-101-577450',
                representante: 'MARIO SAVARD BOIES',
                telefono: '8722-6666',
                whatsapp: '8722-6666'
            },
            auth: {
                adminEmail: 'mariosavardenergysaver@gmail.com',
                adminPassword: 'mario123',
                adminName: 'Mario Savard Boies'
            },
            equipment: {
                'JS-1299': { name: 'JS-1299', precio: 3200, prima: 1100, cuotaUSD: 128, minFactura: 200000, maxFactura: 400000 },
                'JS-1699': { name: 'JS-1699', precio: 4000, prima: 1300, cuotaUSD: 158, minFactura: 401000, maxFactura: 600000 },
                'JS-2099': { name: 'JS-2099', precio: 4600, prima: 1500, cuotaUSD: 178, minFactura: 601000, maxFactura: 850000 },
                'JS-2499': { name: 'JS-2499', precio: 5200, prima: 1750, cuotaUSD: 195, minFactura: 851000, maxFactura: 1200000 }
            },
            financial: {
                TC_BCCR: 512,
                IVA: 0.13,
                ahorroMinimo: 0.20,
                ahorroMaximo: 0.25,
                plazoCuotas: 24
            },
            banking: {
                banco: 'BANCO NACIONAL DE COSTA RICA',
                cuentaUSD: '100-02-119-000012-0',
                ibanUSD: 'CR49015111910020000127',
                cuentaCRC: '100-01-119-000019-1',
                ibanCRC: 'CR12015111910010000190'
            }
        };

export default CONFIG;

export default CONFIG;
