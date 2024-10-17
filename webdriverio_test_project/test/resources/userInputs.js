const testDataUser = {
    userName: {
      positive: ['John', 'JaneDoe AutoMate', 'a'.repeat(3), 'a'.repeat(40)], 
      negative: ['', 'a'.repeat(2),'a'.repeat(41)], 
    },
    fullName: {
      positive: ['John Doe', 'Jane Smith', 'a'.repeat(3), 'a'.repeat(40)],
      negative: ['', 'a'.repeat(2),'a'.repeat(41)],
    },
    email: {
      positive: ['test@example.com', 'user.name111111111111111@domain.com',''],
      negative: ['', 'notAnEmail', 'email@domain', 'email@domain.','user.name1111111111111111@domain.com'],
    },
    phone: {
      positive: ['1', '+48123123123', '123456789123'], 
      negative: ['', '1234567891234', '+123456789123', 'phone123'], 
    },
    address: {
      positive: ['123 Main St', 'Apartment 45B', 'a'.repeat(40)],
      negative: ['', 'a'.repeat(41)],
    },
    dob: {
      positive: ['2000-01-01', '2023-10-15'], 
      negative: ['15-10-2023', '2023/10/15', ''], 
    },
    gender: {
      positive: ['Kobieta', 'Mężczyzna', 'Inna', 'Nie podano'],
      negative: ['Other', ''],
    },
    title: {
      positive: [
        'Software Tester',
        'Frontend Developer',
        'Backend Developer',
        'Business Analyst',
        'Chapter Lead',
        'Product Owner',
        'Fullstack Developer',
        'UX Designer',
      ],
      negative: ['Invalid title', ''],
    },
    isActive: {
      positive: [true],
      negative: [false], 
    },
  };
  
  export default testDataUser;
  