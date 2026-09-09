// import api from "../api";

// export async function getEmployeeAvailability(employeeId, accessToken) {
//   const res = await api.get(`/employeeavailability/${employeeId}`, {
//     method: "GET",
//     headers: {
//       accept: "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`GET availability failed: ${res.status} ${text}`);
//   }
//   return res.json();
// }


// export async function postEmployeeAvailability(employeeId, payload, accessToken) {
//   const res = await api.post(`/employeeavailability/${employeeId}`, {
//     method: "POST",
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${accessToken}`,
//     },
//     body: JSON.stringify(payload),
//   });
//   if (!res.ok) {
//     const text = await res.text();
//     throw new Error(`POST availability failed: ${res.status} ${text}`);
//   }
//   return res.json();
// }
