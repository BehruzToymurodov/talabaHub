const allowedDomains = ["edu.uz", "student.uz"];

export function isStudentEmail(email: string) {
  const lower = email.toLowerCase();
  const domain = lower.split("@")[1] ?? "";

  if (allowedDomains.includes(domain)) return true;
  if (domain.endsWith(".uni.uz")) return true;
  if (lower.endsWith(".edu")) return true;
  if (lower.endsWith(".uz")) return true;
  return false;
}
