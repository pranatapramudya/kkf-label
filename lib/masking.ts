export const maskName = (name: string): string => {
  if (!name) return "";
  const parts = name.split(" ");
  return parts
    .map((part) => {
      if (part.length <= 1) return part;
      return part.charAt(0) + "*".repeat(part.length - 1);
    })
    .join(" ");
};

export const maskEmail = (email: string): string => {
  if (!email) return "";
  const [localPart, domain] = email.split("@");
  if (!domain) return maskName(email); // If it's not a valid email, just mask it like a name

  if (localPart.length <= 1) {
    return `${localPart}***@${domain}`;
  }
  
  const firstChar = localPart.charAt(0);
  return `${firstChar}***@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return "";
  if (phone.length <= 4) return "*".repeat(phone.length);
  const firstTwo = phone.substring(0, 2);
  const lastTwo = phone.substring(phone.length - 2);
  return `${firstTwo}${"*".repeat(phone.length - 4)}${lastTwo}`;
};
