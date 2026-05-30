export interface LegalDocument {
  slug: string
  appName: string
  title: string
  summary: string
  rawUrl: string
  sourceUrl: string
  updatedAt: string
}

export const legalDocuments: LegalDocument[] = [
  {
    slug: 'maia-pos-privacidad',
    appName: 'MAIA POS',
    title: 'Politica de Privacidad',
    summary: 'Tratamiento de datos, seguridad, derechos y contacto del titular.',
    rawUrl:
      'https://raw.githubusercontent.com/NinjaKenshiApp/Ninja-Kenshi-Apps/master/Politica_Privacidad_Maia-POS.md',
    sourceUrl:
      'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/blob/master/Politica_Privacidad_Maia-POS.md',
    updatedAt: '27 de mayo de 2026',
  },
  {
    slug: 'maia-pos-terminos',
    appName: 'MAIA POS',
    title: 'Terminos y Condiciones',
    summary: 'Reglas de uso, licenciamiento, pagos, limitaciones y jurisdiccion.',
    rawUrl:
      'https://raw.githubusercontent.com/NinjaKenshiApp/Ninja-Kenshi-Apps/master/terminos_Maia-Pos.md',
    sourceUrl:
      'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/blob/master/terminos_Maia-Pos.md',
    updatedAt: '27 de mayo de 2026',
  },
  {
    slug: 'maia-pos-documentacion',
    appName: 'MAIA POS',
    title: 'Documentacion de Producto',
    summary: 'Descripcion funcional, modulos, planes y alcance de la plataforma.',
    rawUrl:
      'https://raw.githubusercontent.com/NinjaKenshiApp/Ninja-Kenshi-Apps/master/Readme_Maia-Pos.md',
    sourceUrl:
      'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/blob/master/Readme_Maia-Pos.md',
    updatedAt: '27 de mayo de 2026',
  },
  {
    slug: 'costcalc-pro-documentacion',
    appName: 'CostCalc Pro Plus',
    title: 'Documentacion y Condiciones de Uso',
    summary: 'Alcance funcional, instalacion y enlaces legales de CostCalc Pro Plus.',
    rawUrl:
      'https://raw.githubusercontent.com/NinjaKenshiApp/Ninja-Kenshi-Apps/master/Readme_CostCalcProPlus.md',
    sourceUrl:
      'https://github.com/NinjaKenshiApp/Ninja-Kenshi-Apps/blob/master/Readme_CostCalcProPlus.md',
    updatedAt: '27 de mayo de 2026',
  },
]

export const legalDocumentBySlug = new Map(legalDocuments.map((doc) => [doc.slug, doc]))
