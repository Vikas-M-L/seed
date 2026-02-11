// Utility functions for exporting data to PDF and Excel/CSV
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate PDF file and download directly (without print dialog)
 * @param filename - Filename for the downloaded PDF
 * @param htmlContent - HTML content to convert to PDF
 */
const generateAndDownloadPDF = async (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _title: string,
    filename: string,
    htmlContent: string
): Promise<boolean> => {
    try {
        // Create a temporary container
        const container = document.createElement('div');
        container.innerHTML = htmlContent;
        container.style.position = 'absolute';
        container.style.left = '-9999px';
        container.style.width = '900px';
        container.style.backgroundColor = 'white';
        document.body.appendChild(container);

        // Convert HTML to canvas
        const canvas = await html2canvas(container, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
        });

        // Create PDF from canvas
        const imgData = canvas.toDataURL('image/png');
        const pageWidth = 210; // A4 width in mm
        const pageHeight = 297; // A4 height in mm
        const imgWidth = pageWidth - 20; // 10mm margin on each side
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        const pdf = new jsPDF('p', 'mm', 'a4');
        let yPosition = 10;

        // Add image to PDF with pagination
        let heightLeft = imgHeight;
        while (heightLeft > 0) {
            if (yPosition > 0) {
                pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 10, yPosition, imgWidth, imgHeight);
            heightLeft -= pageHeight - 20;
            yPosition = -imgHeight + (pageHeight - 20);
        }

        // Download PDF
        pdf.save(`${filename}.pdf`);

        // Cleanup
        document.body.removeChild(container);
        return true;
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Failed to generate PDF. Please try again.');
        return false;
    }
};

/**
 * Export data to CSV format (Excel-compatible)
 * @param data - Array of objects to export
 * @param filename - Name of the file (without extension)
 * @param headers - Optional custom headers
 */
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
    try {
        if (!data || data.length === 0) {
            alert('No data to export');
            return;
        }

        // Use provided headers or extract from first object
        const csvHeaders = headers || Object.keys(data[0]);

        // Convert data to CSV rows
        const csvRows = data.map(row =>
            csvHeaders.map(header => {
                const value = row[header] ?? '-';
                // Escape quotes and wrap in quotes
                return `"${String(value).replace(/"/g, '""')}"`;
            }).join(',')
        );

        // Combine headers and rows
        const csvContent = [
            csvHeaders.join(','),
            ...csvRows
        ].join('\n');

        // Create and download blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Error exporting to CSV:', error);
        alert('Failed to export to CSV. Please try again.');
        return false;
    }
};

/**
 * Export data to PDF format with direct download (no print dialog)
 * @param title - Title of the document
 * @param data - Array of objects to export
 * @param headers - Optional custom headers
 * @param summary - Optional summary object to display
 */
export const exportToPDF = async (
    title: string,
    data: any[],
    headers?: string[],
    summary?: Record<string, any>
) => {
    try {
        if (!data || data.length === 0) {
            alert('No data to export');
            return false;
        }

        const tableHeaders = headers || Object.keys(data[0]);

        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>${title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              padding: 40px; 
              background: white;
              color: #333;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding-bottom: 20px;
              border-bottom: 3px solid #8b5cf6;
            }
            h1 { 
              color: #8b5cf6; 
              font-size: 32px;
              margin-bottom: 10px;
            }
            .date {
              color: #6b7280;
              font-size: 14px;
            }
            .summary { 
              margin: 30px 0; 
              padding: 20px; 
              background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
              border-radius: 12px;
              border-left: 4px solid #8b5cf6;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 15px;
              margin-top: 15px;
            }
            .summary-item {
              background: white;
              padding: 15px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .summary-item strong {
              color: #8b5cf6;
              display: block;
              margin-bottom: 5px;
              font-size: 14px;
            }
            .summary-item span {
              font-size: 20px;
              font-weight: bold;
              color: #1f2937;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 30px;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            th, td { 
              border: 1px solid #e5e7eb; 
              padding: 12px; 
              text-align: left; 
            }
            th { 
              background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
              color: white;
              font-weight: 600;
              text-transform: uppercase;
              font-size: 12px;
              letter-spacing: 0.5px;
            }
            tr:nth-child(even) { 
              background-color: #f9fafb; 
            }
            tr:hover {
              background-color: #f3f4f6;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 ${title}</h1>
            <p class="date">Generated on ${new Date().toLocaleString()}</p>
          </div>
          
          ${summary ? `
            <div class="summary">
              <h3 style="color: #8b5cf6; margin-bottom: 15px;">Summary</h3>
              <div class="summary-grid">
                ${Object.entries(summary).map(([key, value]) => `
                  <div class="summary-item">
                    <strong>${key}</strong>
                    <span>${value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
          
          <table>
            <thead>
              <tr>
                ${tableHeaders.map(header => `<th>${header}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${data.map(row => `
                <tr>
                  ${tableHeaders.map(header => `<td>${row[header] ?? '-'}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="footer">
            <p>Attend Ease - SEED Labs Portal</p>
            <p>This is a computer-generated document</p>
          </div>
        </body>
      </html>
    `;

        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `${title.replace(/\s+/g, '_')}_${timestamp}`;

        return await generateAndDownloadPDF(title, filename, htmlContent);
    } catch (error) {
        console.error('Error exporting to PDF:', error);
        alert('Failed to export to PDF. Please try again.');
        return false;
    }
};

/**
 * Export salary slip to PDF with direct download
 * @param slip - Salary slip object
 */
export const exportSalarySlipToPDF = async (slip: any) => {
    try {
        const monthName = new Date(slip.year, slip.month - 1).toLocaleString('default', { month: 'long' });

        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Salary Slip - ${monthName} ${slip.year}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Segoe UI', Arial, sans-serif; 
              padding: 40px; 
              background: white;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              padding: 20px;
              background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
              color: white;
              border-radius: 12px;
            }
            h1 { font-size: 28px; margin-bottom: 5px; }
            .period { font-size: 16px; opacity: 0.9; }
            .content {
              background: white;
              padding: 30px;
              border: 2px solid #e5e7eb;
              border-radius: 12px;
            }
            .section {
              margin-bottom: 25px;
            }
            .section-title {
              font-size: 18px;
              color: #8b5cf6;
              margin-bottom: 15px;
              padding-bottom: 8px;
              border-bottom: 2px solid #e5e7eb;
            }
            .row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #f3f4f6;
            }
            .row:last-child {
              border-bottom: none;
            }
            .label {
              color: #6b7280;
              font-weight: 500;
            }
            .value {
              color: #1f2937;
              font-weight: 600;
            }
            .total-row {
              background: #f9fafb;
              padding: 15px;
              margin-top: 20px;
              border-radius: 8px;
              font-size: 18px;
            }
            .total-row .value {
              color: #8b5cf6;
              font-size: 24px;
            }
            .footer {
              margin-top: 40px;
              padding-top: 20px;
              border-top: 2px solid #e5e7eb;
              text-align: center;
              color: #6b7280;
              font-size: 12px;
            }
            @media print {
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>💰 Salary Slip</h1>
            <p class="period">${monthName} ${slip.year}</p>
          </div>
          
          <div class="content">
            <div class="section">
              <h2 class="section-title">Employee Information</h2>
              <div class="row">
                <span class="label">Employee ID:</span>
                <span class="value">${slip.labMemberId || 'N/A'}</span>
              </div>
              <div class="row">
                <span class="label">Period:</span>
                <span class="value">${monthName} ${slip.year}</span>
              </div>
              <div class="row">
                <span class="label">Status:</span>
                <span class="value">${slip.status}</span>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Earnings</h2>
              <div class="row">
                <span class="label">Base Salary:</span>
                <span class="value">₹${slip.baseSalary.toLocaleString('en-IN')}</span>
              </div>
              <div class="row">
                <span class="label">Allowances:</span>
                <span class="value">₹${slip.allowances?.toLocaleString('en-IN') || '0'}</span>
              </div>
              <div class="row">
                <span class="label">Gross Salary:</span>
                <span class="value">₹${slip.grossSalary?.toLocaleString('en-IN') || slip.baseSalary.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Deductions</h2>
              <div class="row">
                <span class="label">Total Deductions:</span>
                <span class="value" style="color: #ef4444;">-₹${slip.totalDeductions.toLocaleString('en-IN')}</span>
              </div>
              <div class="row">
                <span class="label">LOP Days:</span>
                <span class="value">${slip.lopDays || 0}</span>
              </div>
            </div>

            <div class="section">
              <h2 class="section-title">Attendance</h2>
              <div class="row">
                <span class="label">Days Worked:</span>
                <span class="value">${slip.daysWorked} / ${slip.totalWorkingDays}</span>
              </div>
            </div>

            <div class="total-row row">
              <span class="label" style="font-size: 18px;">Net Salary:</span>
              <span class="value">₹${slip.netSalary.toLocaleString('en-IN')}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>This is a computer-generated salary slip</p>
            <p>Attend Ease - SEED Labs Portal</p>
            <p>Generated on ${new Date().toLocaleString()}</p>
          </div>
        </body>
      </html>
    `;

        const filename = `Salary_Slip_${monthName}_${slip.year}`;
        return await generateAndDownloadPDF(`Salary Slip - ${monthName} ${slip.year}`, filename, htmlContent);
    } catch (error) {
        console.error('Error exporting salary slip:', error);
        alert('Failed to export salary slip. Please try again.');
        return false;
    }
};
