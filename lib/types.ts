export interface Product {
  _id?: string
  id: number
  name: string
  category: string
  image: string
  prices: {
    blinkit: number
    zepto: number
    bigbasket: number
    jiomart: number
  }
  rating: number
  availability: {
    blinkit: boolean
    zepto: boolean
    bigbasket: boolean
    jiomart: boolean
  }
  deliveryTime: {
    blinkit: string
    zepto: string
    bigbasket: string
    jiomart: string
  }
}

export interface Platform {
  id: string
  name: string
  color: string
  url: string
}

export interface Category {
  id: string
  name: string
}

export const platforms: Platform[] = [
  { id: "blinkit", name: "Blinkit", color: "#FFD700", url: "https://blinkit.com" },
  { id: "zepto", name: "Zepto", color: "#8B5CF6", url: "https://zepto.com" },
  { id: "bigbasket", name: "BigBasket", color: "#10B981", url: "https://bigbasket.com" },
  { id: "jiomart", name: "JioMart", color: "#3B82F6", url: "https://jiomart.com" },
]

export const categories: Category[] = [
  { id: "grocery", name: "Grocery" },
  { id: "dairy", name: "Dairy" },
  { id: "snacks", name: "Snacks" },
  { id: "beverages", name: "Beverages" },
  { id: "personal-care", name: "Personal Care" },
  { id: "household", name: "Household" },
  { id: "fruits-vegetables", name: "Fruits & Vegetables" },
  { id: "bakery", name: "Bakery" },
]
