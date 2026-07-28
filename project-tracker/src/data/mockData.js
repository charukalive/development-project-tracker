import { v4 as uuidv4 } from 'uuid';

export const initialProjects = [
  {
    id: uuidv4(),
    name: "Rural Road Development - Stage 1",
    gnDivision: "Colombo North",
    program: "විමධ්‍යගත අයවැය",
    status: "Completed",
    allocation: 15.5,
    disbursed: 15.5,
    contractor: "Silva Constructions",
    startDate: "2023-01-10",
    endDate: "2023-06-15",
    beforeImage: "https://images.unsplash.com/photo-1518242007632-4d2c8032d841?q=80&w=200&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1544256673-8b7762bb95b2?q=80&w=200&auto=format&fit=crop"
  },
  {
    id: uuidv4(),
    name: "Community Hall Construction",
    gnDivision: "Kandy Central",
    program: "ග්‍රාමීය සංවර්ධන",
    status: "In Progress",
    allocation: 8.2,
    disbursed: 4.1,
    contractor: "Perera Builders",
    startDate: "2023-08-01",
    endDate: "2024-02-28",
    beforeImage: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=80&w=200&auto=format&fit=crop",
    afterImage: null
  },
  {
    id: uuidv4(),
    name: "Water Supply Scheme Expansion",
    gnDivision: "Galle South",
    program: "ප්‍රාදේශීය යටිතල පහසුකම්",
    status: "In Progress",
    allocation: 25.0,
    disbursed: 10.0,
    contractor: "Southern Engineering Co.",
    startDate: "2023-11-15",
    endDate: "2024-11-15",
    beforeImage: "https://images.unsplash.com/photo-1527685655470-3669fcf785bc?q=80&w=200&auto=format&fit=crop",
    afterImage: null
  },
  {
    id: uuidv4(),
    name: "Library Renovation",
    gnDivision: "Colombo North",
    program: "විමධ්‍යගත අයවැය",
    status: "Completed",
    allocation: 3.5,
    disbursed: 3.5,
    contractor: "EduBuild PVT LTD",
    startDate: "2023-03-01",
    endDate: "2023-05-30",
    beforeImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=200&auto=format&fit=crop",
    afterImage: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=200&auto=format&fit=crop"
  }
];