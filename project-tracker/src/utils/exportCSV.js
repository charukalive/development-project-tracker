export const exportToCSV = (projects) => {
  if (!projects || !projects.length) return;

  const headers = [
    'ID',
    'Project Name',
    'GN Division',
    'Program',
    'Status',
    'Allocation (LKR M)',
    'Disbursed (LKR M)',
    'Contractor',
    'Start Date',
    'End Date'
  ];

  const csvRows = [];
  csvRows.push(headers.join(','));

  projects.forEach(p => {
    const row = [
      p.id,
      `"${p.name.replace(/"/g, '""')}"`,
      `"${p.gnDivision}"`,
      `"${p.program}"`,
      p.status,
      p.allocation,
      p.disbursed,
      `"${p.contractor}"`,
      p.startDate,
      p.endDate || ''
    ];
    csvRows.push(row.join(','));
  });

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });

  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `projects_export_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
