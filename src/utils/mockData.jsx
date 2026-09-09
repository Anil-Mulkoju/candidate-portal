// import { Box } from "@mui/material";

// export const data = [
//   {
//     firstName: 'Anil',
//     lastName: 'Kumar',
//     email: 'anil.kumar@ri8fit.com',
//     jobTitle: 'Frontend Developer',
//     salary: 65000,
//     startDate: '2022-03-15',
//     avatar: 'https://i.pravatar.cc/150?img=12',
//     signatureCatchPhrase: 'Clean code is not written by accident.',
//   },
//   {
//     firstName: 'Ravi',
//     lastName: 'Teja',
//     email: 'ravi.teja@ri8fit.com',
//     jobTitle: 'Backend Developer',
//     salary: 78000,
//     startDate: '2021-07-01',
//     avatar: 'https://i.pravatar.cc/150?img=32',
//     signatureCatchPhrase: 'APIs are the backbone of modern apps.',
//   },
//   {
//     firstName: 'Suresh',
//     lastName: 'Reddy',
//     email: 'suresh.reddy@ri8fit.com',
//     jobTitle: 'Full Stack Developer',
//     salary: 90000,
//     startDate: '2020-11-20',
//     avatar: 'https://i.pravatar.cc/150?img=45',
//     signatureCatchPhrase: 'Think twice, code once.',
//   },
//   {
//     firstName: 'Priya',
//     lastName: 'Sharma',
//     email: 'priya.sharma@ri8fit.com',
//     jobTitle: 'UI/UX Designer',
//     salary: 72000,
//     startDate: '2022-01-10',
//     avatar: 'https://i.pravatar.cc/150?img=47',
//     signatureCatchPhrase: 'Design is intelligence made visible.',
//   },
//   {
//     firstName: 'Kiran',
//     lastName: 'Patel',
//     email: 'kiran.patel@ri8fit.com',
//     jobTitle: 'QA Engineer',
//     salary: 58000,
//     startDate: '2023-05-05',
//     avatar: 'https://i.pravatar.cc/150?img=22',
//     signatureCatchPhrase: 'Quality is never an accident.',
//   },
//   {
//     firstName: 'Neha',
//     lastName: 'Verma',
//     email: 'neha.verma@ri8fit.com',
//     jobTitle: 'Project Manager',
//     salary: 95000,
//     startDate: '2019-09-18',
//     avatar: 'https://i.pravatar.cc/150?img=36',
//     signatureCatchPhrase: 'Plans are useless, planning is everything.',
//   },
//   {
//     firstName: 'Arjun',
//     lastName: 'Mehta',
//     email: 'arjun.mehta@ri8fit.com',
//     jobTitle: 'DevOps Engineer',
//     salary: 88000,
//     startDate: '2021-02-08',
//     avatar: 'https://i.pravatar.cc/150?img=18',
//     signatureCatchPhrase: 'Automate everything.',
//   },
//   {
//     firstName: 'Sneha',
//     lastName: 'Iyer',
//     email: 'sneha.iyer@ri8fit.com',
//     jobTitle: 'Data Analyst',
//     salary: 70000,
//     startDate: '2022-08-25',
//     avatar: 'https://i.pravatar.cc/150?img=29',
//     signatureCatchPhrase: 'Data tells a story.',
//   },
//   {
//     firstName: 'Vikram',
//     lastName: 'Singh',
//     email: 'vikram.singh@ri8fit.com',
//     jobTitle: 'Mobile App Developer',
//     salary: 82000,
//     startDate: '2020-06-14',
//     avatar: 'https://i.pravatar.cc/150?img=9',
//     signatureCatchPhrase: 'Build fast, build right.',
//   },
//   {
//     firstName: 'Pooja',
//     lastName: 'Nair',
//     email: 'pooja.nair@ri8fit.com',
//     jobTitle: 'HR Manager',
//     salary: 68000,
//     startDate: '2018-12-01',
//     avatar: 'https://i.pravatar.cc/150?img=50',
//     signatureCatchPhrase: 'People make the company.',
//   },
// ];
// export const employeeColumns = [
//   {
//     accessorFn: (row) => `${row.firstName} ${row.lastName}`,
//     id: "name",
//     header: "Name",
//     size: 250,
//     Cell: ({ renderedCellValue, row }) => (
//       <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
//         <img
//           src={row.original.avatar}
//           height={30}
//           style={{ borderRadius: "50%" }}
//         />
//         {renderedCellValue}
//       </Box>
//     ),
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     filterVariant: "autocomplete",
//   },
//   {
//     accessorKey: "jobTitle",
//     header: "Job Title",
//   },
//   {
//     accessorKey: "salary",
//     header: "Salary",
//     filterFn: "between",
//   },
// ];