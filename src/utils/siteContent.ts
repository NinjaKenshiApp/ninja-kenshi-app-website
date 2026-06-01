import type { AppItem, BrandMeta, ReviewItem } from '../types/site'

const brandAsset = (fileName: string): string => `${import.meta.env.BASE_URL}brand/${fileName}`

export const brandMeta: BrandMeta = {
  name: 'El Ninja Kenshi APP',
  logo: brandAsset('ninja-kenshi-logo.png'),
}

export const appItems: AppItem[] = [
  {
    id: 'maia-pos',
    name: 'MAIA POS',
    logo: brandAsset('maia-pos-logo.png'),
    tagline: 'Sistema de punto de venta profesional para comercios y emprendedores.',
    description:
      'POS multiplataforma para Windows y Android con ventas, inventario, clientes, reportes y licenciamiento SaaS. Diseñado para rendimiento alto en mostrador y dispositivos moviles.',
    status: 'Publicado',
    tech: ['React 19', 'Vite', 'TypeScript', 'Electron', 'Capacitor', 'Supabase'],
    highlights: [
      'Punto de venta con descuentos, metodos de pago multiples y calculo de vuelto',
      'Inventario avanzado con kits, recetas e insumos',
      'Caja diaria, reportes PDF, backup y restauracion local',
    ],
    version: 'v1.3.2',
    lastUpdate: 'May 2026',
    modules: [
      {
        title: 'POS y ventas',
        items: [
          'Carrito con busqueda instantanea de productos',
          'Pagos: efectivo, tarjeta, transferencia y MercadoPago',
          'Historial de ventas con filtros, reapertura y anulacion',
          'Impresion de comprobantes en modo thermal y normal',
        ],
      },
      {
        title: 'Inventario y produccion',
        items: [
          'Productos, categorias, stock bajo y movimientos',
          'Kits/combos con impacto automatico en inventario',
          'Recetas, insumos y produccion por lote',
          'Venta por unidad, peso, volumen y fracciones',
        ],
      },
      {
        title: 'Gestion y control',
        items: [
          'Clientes con historial, deudas y pagos a cuenta',
          'Caja diaria, ingresos, egresos y rentabilidad',
          'Reportes por periodo, tendencias y productos mas vendidos',
          'Configuracion de empresa, impresoras y herramientas extra',
        ],
      },
    ],
    plans: [
      {
        name: 'Prueba gratuita',
        price: '$0 / 14 dias',
        description: 'Acceso completo a todas las funcionalidades.',
      },
      {
        name: 'Mensual',
        price: '$9.900 ARS / mes',
        description: 'Renovacion automatica con facturacion mensual.',
      },
      {
        name: 'Anual',
        price: '$59.000 ARS / ano',
        description: '50% de ahorro frente al plan mensual.',
      },
    ],
    platforms: [
      {
        name: 'Windows',
        tech: 'Electron',
        requirement: 'Windows 10/11 64-bit',
        downloadUrl: 'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/releases/download/maia-pos-v1.3.2/maia-pos-windows.exe',
        downloadLabel: 'Descargar Windows',
      },
      {
        name: 'Android',
        tech: 'Capacitor',
        requirement: 'Android 8.0 (API 26) o superior',
        downloadUrl: 'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/releases/download/maia-pos-android-v1.3.2/maia-pos-android.apk',
        downloadLabel: 'Descargar Android',
      },
    ],
    security: [
      'Acceso seguro con verificacion por email.',
      'Los datos de trabajo se guardan localmente en tu dispositivo.',
    ],
    legalLinks: [
      { label: 'Politica de Privacidad', href: 'maia-pos-privacidad' },
      { label: 'Terminos de Servicio', href: 'maia-pos-terminos' },
      { label: 'README / Documentacion', href: 'maia-pos-documentacion' },
    ],
    supportEmail: 'elninjakenshi.app@gmail.com',
  },
  {
    id: 'costcalc-pro',
    name: 'CostCalc Pro Plus',
    logo: brandAsset('costcalc-pro-logo.png'),
    tagline: 'Calculadora de costos profesional para gastronomia y emprendimientos.',
    description:
      'Calcula costo por unidad con recetas, materias primas y gastos generales. Funciona offline y genera reportes PDF con datos listos para decision comercial.',
    status: 'Publicado',
    tech: ['React', 'Vite', 'IndexedDB', 'PDF', 'Multilenguaje'],
    highlights: [
      'Gestion de recetas personalizadas con ingredientes y cantidades',
      'Control de materias primas y gastos generales',
      'Exportacion/importacion de datos y reportes PDF',
    ],
    version: 'Plus',
    lastUpdate: 'May 2026',
    modules: [
      {
        title: 'Calculo y produccion',
        items: [
          'Costo por unidad calculado automaticamente',
          'Edicion de recetas con consumos y cantidades',
          'Ajuste de precios y margen por producto',
        ],
      },
      {
        title: 'Operacion diaria',
        items: [
          'Gestion de materias primas con costos actualizados',
          'Registro de gastos fijos y variables',
          'Trabajo offline de punta a punta',
        ],
      },
    ],
    platforms: [
      {
        name: 'Android',
        tech: 'Google Play',
        requirement: 'Disponible exclusivamente en Android desde Google Play',
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.ninjakenshiapp.costcalcproplus&hl=es_AR',
        downloadLabel: 'Descargar en Google Play',
      },
    ],
    legalLinks: [
      {
        label: 'README / Documentacion',
        href: 'costcalc-pro-documentacion',
      },
    ],
    supportEmail: 'elninjakenshi.app@gmail.com',
  },
  {
    id: 'proxima-app',
    name: 'Próxima app',
    tagline: 'Nuevo producto en camino.',
    description: '',
    status: 'Proximamente',
    tech: [],
    highlights: [],
    version: '',
    lastUpdate: '',
  },
]

export const reviews: ReviewItem[] = [
  {
    id: 'r1',
    author: 'Mariana L.',
    role: 'Dulceria artesanal',
    quote:
      'Con MAIA POS pude ordenar ventas y stock en una semana. La caja diaria ahora cierra sin dolores de cabeza.',
    rating: 5,
  },
  {
    id: 'r2',
    author: 'Jorge A.',
    role: 'Rotiseria de barrio',
    quote:
      'La venta por peso y las recetas me simplificaron todo. Lo uso en mostrador y en el celu sin friccion.',
    rating: 5,
  },
  {
    id: 'r3',
    author: 'Claudia R.',
    role: 'Pasteleria boutique',
    quote:
      'CostCalc Pro me permitio ajustar precios con datos reales. El calculo por unidad es claro y rapido.',
    rating: 5,
  },
  {
    id: 'r4',
    author: 'Diego T.',
    role: 'Autoservicio familiar',
    quote:
      'Pasamos de anotar en papel a tener control real de inventario. Menos perdidas, mas ventas.',
    rating: 5,
  },
  {
    id: 'r5',
    author: 'Lorena C.',
    role: 'Panaderia',
    quote:
      'El cierre de caja y los reportes semanales me ahorran horas. Super claro para decidir compras.',
    rating: 5,
  },
  {
    id: 'r6',
    author: 'Pablo M.',
    role: 'Food truck',
    quote:
      'Necesitaba algo rapido y estable. MAIA POS anda fluido incluso en horario pico.',
    rating: 5,
  },
  {
    id: 'r7',
    author: 'Agustina V.',
    role: 'Emprendedora gastronomica',
    quote:
      'Con CostCalc Pro deje de poner precios a ojo. Ahora tengo margen controlado producto por producto.',
    rating: 5,
  },
  {
    id: 'r8',
    author: 'Nicolas B.',
    role: 'Kiosco 24hs',
    quote:
      'El historial de ventas con filtros es una joya. Veo que se mueve y que no, en segundos.',
    rating: 4,
  },
  {
    id: 'r9',
    author: 'Carla S.',
    role: 'Reposteria premium',
    quote:
      'La experiencia visual y la velocidad de la app transmiten profesionalismo frente al cliente.',
    rating: 5,
  },
  {
    id: 'r10',
    author: 'Hector D.',
    role: 'Dietetica',
    quote:
      'La venta por peso y las unidades de medida simplifican todo. Cero errores de calculo.',
    rating: 5,
  },
  {
    id: 'r11',
    author: 'Sofia N.',
    role: 'Cafe de especialidad',
    quote:
      'La combinacion MAIA POS + CostCalc Pro me dio orden operativo y vision financiera real.',
    rating: 5,
  },
]
