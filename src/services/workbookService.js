export async function importWorkbookFromAPI() {
  const response = await fetch('http://localhost:8080/api/v1/workbook/import', {
    method: 'POST',
  });
  if (!response.ok) throw new Error('Failed to import workbook');
  return response.json();
}

export async function fetchWorkbookById(workbookId) {
  const response = await fetch(`http://localhost:8080/api/v1/workbook/${workbookId}`, {
    method: 'GET',
  });
  if (!response.ok) throw new Error('Failed to fetch workbook');
  return response.json();
} 