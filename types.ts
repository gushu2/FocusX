
export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
}

export interface Plan {
  name: 'Spark' | 'Creator' | 'Zenith';
  price: string;
  pricePeriod: string;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'Spark' | 'Creator' | 'Zenith';
}