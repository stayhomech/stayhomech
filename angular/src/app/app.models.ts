
export interface Business {
  pk: number,
  name: string,
  description: string,
  location: string,
  website: string,
  phone: string,
  email: string,
  categories: string[],
  cantons: string[],
  districts: string[],
  municipalities: string[],
  npas: string[],
  category: string,
  deliversCH?: boolean
}

