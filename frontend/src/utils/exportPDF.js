import jsPDF from "jspdf";
import "jspdf-autotable"; // <-- This line is crucial!

export function exportTableToPDF(headers, data, filename) {
  const doc = new jsPDF();
  doc.autoTable({
    head: [headers],
    body: data,
  });
  doc.save(filename);
}