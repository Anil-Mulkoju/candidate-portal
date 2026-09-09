// constants.js

export const countryOptions = [
  {
    code: "IN",
    label: "India",
    phone: "91",
    flag: (
      <svg
        width="24"
        height="16"
        viewBox="0 0 24 16"
        style={{ marginRight: "8px" }}
      >
        <rect x="0" y="0" width="24" height="5.33" fill="#FF9933" />
        <rect x="0" y="5.33" width="24" height="5.33" fill="#FFFFFF" />
        <rect x="0" y="10.66" width="24" height="5.33" fill="#138808" />
        <circle cx="12" cy="8" r="2" fill="#000080" />
      </svg>
    ),
  },
  {
    code: "US",
    label: "United States",
    phone: "1",
    flag: (
      <svg
        width="24"
        height="16"
        viewBox="0 0 24 16"
        style={{ marginRight: "8px" }}
      >
        <rect x="0" y="0" width="24" height="16" fill="#B22234" />
        <rect x="0" y="0" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="2.46" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="4.92" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="7.38" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="9.84" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="12.3" width="24" height="1.23" fill="#FFFFFF" />
        <rect x="0" y="0" width="9.6" height="8.62" fill="#3C3B6E" />
        {Array.from({ length: 50 }, (_, i) => (
          <circle
            key={i}
            cx={1 + (i % 10) * 0.96}
            cy={1 + Math.floor(i / 10) * 1.72}
            r="0.2"
            fill="#FFFFFF"
          />
        ))}
      </svg>
    ),
  },
];

export const formatPhoneNumber = (value, countryCode) => {
  if (!value) return "";

  const cleaned = value.replace(/[^0-9-]/g, "");

  if (countryCode === "+91") {
    return cleaned.slice(0, 10);
  }

  if (countryCode === "+1") {
    const digits = cleaned.replace(/-/g, "").slice(0, 10);

    const match = digits.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);

    if (!match) return digits;

    let formatted = "";

    if (match[1]) formatted += match[1];
    if (match[2]) formatted += `-${match[2]}`;
    if (match[3]) formatted += `-${match[3]}`;

    return formatted;
  }

  return value;
};