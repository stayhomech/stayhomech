export interface BusinessSearch {
  npa: Npa,
  municipality: Municipality
  district: District
  canton: Canton
  businesses: Business[]
  categories: Category[]
  parent_categories: Category[]
}

export interface Category {
  id: number
  name: string
  parent: number
}

export interface Business {
  id: number
  name: string
  description: string
  main_category: number
  other_categories: number[]
  location_npa: number
  location_name: string
  distance: Distance,
  website: string,
  phone: string
}

export interface Distance {
  angle: number,
  km: number
}

export interface Npa {
  id: number
  npa: number
  name: string
  lang: number
  geo_e: number
  geo_n: number
}

export interface Municipality {
  id: number
  name: string
}

export interface District {
  id: number
  name: string
}

export interface Canton {
  id: number
  code: string
  name: string
}
