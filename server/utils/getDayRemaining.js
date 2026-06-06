function getDaysRemaining(currentEnd) {
  if (!currentEnd) return 0;

  const now = new Date();
  const renewalDate = new Date(currentEnd * 1000);
  const diffMs = renewalDate - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}
export default getDaysRemaining;
