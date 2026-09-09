import api from "../api";

// export const registerUser = (formData) => {
//     return api.post('/api/register', {
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData),
//     })
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error('Registration failed. Please try again.');
//             }
//             return response.json();
//         })
//         .then((data) => {
//             return data;
//         })
//         .catch((error) => {
//             throw new Error('Registration failed. Please try again.');
//         });
// };
