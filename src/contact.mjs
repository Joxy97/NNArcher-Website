export function validateBooking(data) {
  if (!data || typeof data !== "object" || Array.isArray(data)) return ["form"];
  const errors = [];
  const validString = (key, min, max) =>
    typeof data[key] === "string" &&
    data[key].trim().length >= min &&
    data[key].length <= max &&
    !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(data[key]);
  if (!validString("name", 2, 150) || /[\r\n]/.test(data.name))
    errors.push("name");
  if (
    !validString("email", 3, 254) ||
    !/^\S+@[^\s@]+\.[^\s@]+$/.test(data.email)
  )
    errors.push("email");
  if (!validString("phone", 5, 50) || !/^[+()\d\s.\-/]+$/.test(data.phone))
    errors.push("phone");
  if (!["Venčanje", "Portret", "Poslovni", "Proslava"].includes(data.service))
    errors.push("service");
  if (
    !validString("date", 10, 10) ||
    !/^\d{4}-\d{2}-\d{2}$/.test(data.date) ||
    !Number.isFinite(Date.parse(data.date)) ||
    new Date(data.date).toISOString().slice(0, 10) !== data.date
  )
    errors.push("date");
  if (data.details !== undefined && !validString("details", 0, 5000))
    errors.push("details");
  if (
    !Array.isArray(data.communication) ||
    data.communication.length > 3 ||
    data.communication.some(
      (x) => !["Telefonom", "Video pozivom", "Uživo"].includes(x),
    )
  )
    errors.push("communication");
  return errors;
}
export function formatBooking(data) {
  return `NOVI UPIT ZA FOTOGRAFISANJE\n\nIme i prezime: ${data.name.trim()}\nImejl: ${data.email.trim()}\nTelefon: ${data.phone.trim()}\nUsluga: ${data.service}\nDatum: ${data.date}\nKomunikacija: ${data.communication.join(", ") || "Po dogovoru"}\n\nPaket / specifične potrebe:\n${data.details || "—"}\n\nTermin nije automatski potvrđen.\n`;
}
