// Mock voter data for testing the VoterManagement component
export const mockVoters = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@university.edu',
    matriculationNumber: 'CSC/2020/001',
    level: '300',
    department: 'Computer Science',
    hasVoted: true,
    createdAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@university.edu',
    matriculationNumber: 'ENG/2021/045',
    level: '200',
    department: 'Engineering',
    hasVoted: false,
    createdAt: '2024-01-16T14:20:00Z'
  },
  {
    id: '3',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'michael.johnson@university.edu',
    matriculationNumber: 'BUS/2019/123',
    level: '400',
    department: 'Business Administration',
    hasVoted: true,
    createdAt: '2024-01-17T09:15:00Z'
  },
  {
    id: '4',
    firstName: 'Sarah',
    lastName: 'Williams',
    email: 'sarah.williams@university.edu',
    matriculationNumber: 'MED/2022/078',
    level: '100',
    department: 'Medicine',
    hasVoted: false,
    createdAt: '2024-01-18T16:45:00Z'
  },
  {
    id: '5',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david.brown@university.edu',
    matriculationNumber: 'LAW/2020/234',
    level: '300',
    department: 'Law',
    hasVoted: true,
    createdAt: '2024-01-19T11:30:00Z'
  },
  {
    id: '6',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@university.edu',
    matriculationNumber: 'ART/2021/156',
    level: '200',
    department: 'Arts',
    hasVoted: false,
    createdAt: '2024-01-20T13:25:00Z'
  },
  {
    id: '7',
    firstName: 'Robert',
    lastName: 'Miller',
    email: 'robert.miller@university.edu',
    matriculationNumber: 'SCI/2019/089',
    level: '400',
    department: 'Science',
    hasVoted: true,
    createdAt: '2024-01-21T08:10:00Z'
  },
  {
    id: '8',
    firstName: 'Lisa',
    lastName: 'Wilson',
    email: 'lisa.wilson@university.edu',
    matriculationNumber: 'EDU/2022/067',
    level: '100',
    department: 'Education',
    hasVoted: false,
    createdAt: '2024-01-22T15:40:00Z'
  },
  {
    id: '9',
    firstName: 'James',
    lastName: 'Moore',
    email: 'james.moore@university.edu',
    matriculationNumber: 'PHY/2020/145',
    level: '300',
    department: 'Physics',
    hasVoted: true,
    createdAt: '2024-01-23T12:55:00Z'
  },
  {
    id: '10',
    firstName: 'Amanda',
    lastName: 'Taylor',
    email: 'amanda.taylor@university.edu',
    matriculationNumber: 'CHE/2021/198',
    level: '200',
    department: 'Chemistry',
    hasVoted: false,
    createdAt: '2024-01-24T10:20:00Z'
  },
  {
    id: '11',
    firstName: 'Christopher',
    lastName: 'Anderson',
    email: 'chris.anderson@university.edu',
    matriculationNumber: 'MAT/2019/076',
    level: '400',
    department: 'Mathematics',
    hasVoted: true,
    createdAt: '2024-01-25T14:15:00Z'
  },
  {
    id: '12',
    firstName: 'Jessica',
    lastName: 'Thomas',
    email: 'jessica.thomas@university.edu',
    matriculationNumber: 'BIO/2022/134',
    level: '100',
    department: 'Biology',
    hasVoted: false,
    createdAt: '2024-01-26T09:30:00Z'
  },
  {
    id: '13',
    firstName: 'Daniel',
    lastName: 'Jackson',
    email: 'daniel.jackson@university.edu',
    matriculationNumber: 'GEO/2020/087',
    level: '300',
    department: 'Geography',
    hasVoted: true,
    createdAt: '2024-01-27T16:10:00Z'
  },
  {
    id: '14',
    firstName: 'Michelle',
    lastName: 'White',
    email: 'michelle.white@university.edu',
    matriculationNumber: 'PSY/2021/203',
    level: '200',
    department: 'Psychology',
    hasVoted: false,
    createdAt: '2024-01-28T11:45:00Z'
  },
  {
    id: '15',
    firstName: 'Kevin',
    lastName: 'Harris',
    email: 'kevin.harris@university.edu',
    matriculationNumber: 'ECO/2019/165',
    level: '400',
    department: 'Economics',
    hasVoted: true,
    createdAt: '2024-01-29T13:20:00Z'
  }
];

// Function to simulate API delay
export const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API functions
export const mockAdminAPI = {
  getAllVoters: async () => {
    await delay(1000); // Simulate network delay
    return {
      data: mockVoters,
      success: true
    };
  },
  
  searchVoters: async (searchParams) => {
    await delay(800);
    let filtered = [...mockVoters];
    
    if (searchParams.search) {
      const searchTerm = searchParams.search.toLowerCase();
      filtered = filtered.filter(voter => 
        `${voter.firstName} ${voter.lastName}`.toLowerCase().includes(searchTerm) ||
        voter.matriculationNumber.toLowerCase().includes(searchTerm) ||
        voter.email.toLowerCase().includes(searchTerm)
      );
    }
    
    if (searchParams.level) {
      filtered = filtered.filter(voter => voter.level === searchParams.level);
    }
    
    if (searchParams.status) {
      if (searchParams.status === 'voted') {
        filtered = filtered.filter(voter => voter.hasVoted);
      } else if (searchParams.status === 'not-voted') {
        filtered = filtered.filter(voter => !voter.hasVoted);
      }
    }
    
    return {
      data: filtered,
      success: true
    };
  }
};