import { useState, useEffect } from 'preact/hooks';
import DOMPurify from 'dompurify';

// Define utility functions using DOMPurify
const sanitizeUrl = (url) => DOMPurify.sanitize(url);
const escapeHtml = (html) => DOMPurify.sanitize(html);

export default function PuffProcurementApp() {
    const [tableData, setTableData] = useState([
        {
            itemName: "Soil",
            purpose: "Nutrients",
            totalQuantity: 100,
            vendorOptions: "A, B",
            costVendor1: 10,
            costVendor2: 12,
            estimatedCostVendor1: 1000,
            estimatedCostVendor2: 1200,
            lowestFinalCost: 1000
        }
    ]);

    const calculateCosts = (totalQuantity, costVendor1, costVendor2) => {
        const estimatedCostVendor1 = totalQuantity * costVendor1;
        const estimatedCostVendor2 = totalQuantity * costVendor2;
        return {
            estimatedCostVendor1,
            estimatedCostVendor2,
            lowestFinalCost: Math.min(estimatedCostVendor1, estimatedCostVendor2)
        };
    };

    useEffect(() => {
        const updatedTableData = tableData.map((row) => {
            const { estimatedCostVendor1, estimatedCostVendor2, lowestFinalCost } = calculateCosts(row.totalQuantity, row.costVendor1, row.costVendor2);
            return {
                ...row,
                estimatedCostVendor1,
                estimatedCostVendor2,
                lowestFinalCost
            };
        });
        setTableData(updatedTableData);
    }, []);

    const handleEdit = (rowIndex, field, value) => {
        const updatedTableData = [...tableData];

        if (field === 'totalQuantity' || field === 'costVendor1' || field === 'costVendor2') {
            const parsedValue = Number(value);
            if (!isNaN(parsedValue)) {
                updatedTableData[rowIndex][field] = parsedValue;

                const totalQuantity = updatedTableData[rowIndex].totalQuantity;
                const costVendor1 = updatedTableData[rowIndex].costVendor1;
                const costVendor2 = updatedTableData[rowIndex].costVendor2;

                const { estimatedCostVendor1, estimatedCostVendor2, lowestFinalCost } = calculateCosts(totalQuantity, costVendor1, costVendor2);

                updatedTableData[rowIndex].estimatedCostVendor1 = estimatedCostVendor1;
                updatedTableData[rowIndex].estimatedCostVendor2 = estimatedCostVendor2;
                updatedTableData[rowIndex].lowestFinalCost = lowestFinalCost;
            } else {
                updatedTableData[rowIndex][field] = 0;
            }
        } else {
            updatedTableData[rowIndex][field] = value;
        }

        setTableData(updatedTableData);
    };

    const addRow = () => {
        const newRow = {
            itemName: "",
            purpose: "",
            totalQuantity: 0,
            vendorOptions: "",
            costVendor1: 0,
            costVendor2: 0,
            estimatedCostVendor1: 0,
            estimatedCostVendor2: 0,
            lowestFinalCost: 0
        };
        setTableData([...tableData, newRow]);
    };

    const removeRow = (rowIndex) => {
        const updatedTableData = tableData.filter((_, index) => index !== rowIndex);
        setTableData(updatedTableData);
    };

    const totalLowestFinalCost = tableData.reduce((sum, row) => sum + row.lowestFinalCost, 0);

    const printTable = () => {
        // Create a new window for printing
        const printWindow = window.open('', '_blank');

        // Check if window was successfully opened
        if (!printWindow) {
            alert("Unable to open print window. Please check if popup blocker is enabled.");
            return;
        }

        // Get the site logo (assuming it has a specific class or id)
        const logoElement = document.querySelector('.site-logo') || document.querySelector('header img');
        const logoSrc = logoElement ? sanitizeUrl((logoElement as HTMLImageElement).src) : '';

        // Create a copy of the table with text values instead of inputs
        const tableClone = document.createElement('table');
        const originalTable = document.querySelector('.procurement-app table');

        if (originalTable) {
            // Clone the table structure
            tableClone.innerHTML = originalTable.innerHTML;

            // Replace inputs with their text values
            const inputs = tableClone.querySelectorAll('input');
            inputs.forEach(input => {
                const value = input.getAttribute('value') || '';
                const td = input.parentNode;
                if (td) {
                    td.textContent = value;
                }
            });

            // Remove action buttons
            const actionButtons = tableClone.querySelectorAll('button');
            actionButtons.forEach(button => {
                const td = button.parentNode;
                if (td) {
                    td.textContent = '';
                }
            });
        }

        // Create the print content with CSS
        const printContent = `
            <!DOCTYPE html>
            <html>
            <head>
                <title>Procurement Table</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        padding: 20px;
                        color: #333;
                    }
                    .print-header {
                        display: flex;
                        align-items: center;
                        margin-bottom: 20px;
                    }
                    .logo {
                        max-height: 60px;
                        margin-right: 20px;
                    }
                    h1 {
                        font-size: 24px;
                        margin: 0;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 30px;
                        font-size: 12px;
                    }
                    th {
                        background-color: #f0f0f0;
                        color: #333;
                        text-align: left;
                        padding: 8px;
                        font-weight: bold;
                        border-bottom: 2px solid #ddd;
                    }
                    td {
                        padding: 8px;
                        border-bottom: 1px solid #ddd;
                    }
                    tr:nth-child(even) {
                        background-color: #f9f9f9;
                    }
                    tfoot {
                        font-weight: bold;
                    }
                    tfoot td {
                        border-top: 2px solid #ddd;
                    }
                    @media print {
                        body {
                            padding: 0;
                        }
                    }
                </style>
            </head>
            <body>
                <div class="print-header">
                    ${logoSrc ? `<img class="logo" src="${escapeHtml(logoSrc)}" alt="Puff Provisions Logo" />` : ''}
                    <h1>Procurement Comparison</h1>
                </div>
                <table>
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Purpose</th>
                            <th>Quantity</th>
                            <th>Vendors</th>
                            <th>Price A</th>
                            <th>Price B</th>
                            <th>Total A</th>
                            <th>Total B</th>
                            <th>Lowest</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableData.map(row => `
                            <tr>
                                <td>${row.itemName}</td>
                                <td>${row.purpose}</td>
                                <td>${row.totalQuantity}</td>
                                <td>${row.vendorOptions}</td>
                                <td>$${row.costVendor1.toFixed(2)}</td>
                                <td>$${row.costVendor2.toFixed(2)}</td>
                                <td>$${row.estimatedCostVendor1.toFixed(2)}</td>
                                <td>$${row.estimatedCostVendor2.toFixed(2)}</td>
                                <td>$${row.lowestFinalCost.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="8">Total Lowest Cost:</td>
                            <td>$${totalLowestFinalCost.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>
                <div class="print-footer">
                    <p>Generated on ${new Date().toLocaleDateString()} - PuffProvisions.com</p>
                </div>
            </body>
            </html>
        `;

        // Write to the new window and print
        printWindow.document.open();
        printWindow.document.write(printContent);
        printWindow.document.close();

        // Print after everything is loaded
        printWindow.onload = () => {
            setTimeout(() => {
                printWindow.focus();
                printWindow.print();
            }, 500);
        };
    };

    return (
        <div className="procurement-app">
            <style jsx>{`
                .procurement-app {
                    font-family: inherit;
                    width: 100%;
                    overflow-x: hidden; /* Changed from auto to hidden */
                }

                .procurement-app table {
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 1.5rem;
                    font-size: 0.8rem; /* Reduced font size */
                    table-layout: fixed; /* Added fixed layout */
                }

                .procurement-app th {
                    background-color: var(--color-primary, #4f46e5);
                    color: white;
                    text-align: left;
                    padding: 0.5rem 0.25rem; /* Reduced padding */
                    font-weight: 600;
                    position: sticky;
                    top: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.75rem; /* Smaller header text */
                }

                .procurement-app td {
                    padding: 0.5rem 0.25rem; /* Reduced padding */
                    border-bottom: 1px solid var(--color-border, #e5e7eb);
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                /* Define specific column widths */
                .procurement-app th:nth-child(1), .procurement-app td:nth-child(1) { width: 14%; }
                .procurement-app th:nth-child(2), .procurement-app td:nth-child(2) { width: 12%; }
                .procurement-app th:nth-child(3), .procurement-app td:nth-child(3) { width: 8%; }
                .procurement-app th:nth-child(4), .procurement-app td:nth-child(4) { width: 12%; }
                .procurement-app th:nth-child(5), .procurement-app td:nth-child(5) { width: 8%; }
                .procurement-app th:nth-child(6), .procurement-app td:nth-child(6) { width: 8%; }
                .procurement-app th:nth-child(7), .procurement-app td:nth-child(7) { width: 10%; }
                .procurement-app th:nth-child(8), .procurement-app td:nth-child(8) { width: 10%; }
                .procurement-app th:nth-child(9), .procurement-app td:nth-child(9) { width: 10%; }
                .procurement-app th:nth-child(10), .procurement-app td:nth-child(10) { width: 8%; }

                .procurement-app tr:nth-child(even) {
                    background-color: var(--color-background-alt, rgba(0, 0, 0, 0.02));
                }

                .procurement-app tr:hover {
                    background-color: var(--color-background-hover, rgba(0, 0, 0, 0.05));
                }

                .procurement-app input {
                    width: 100%;
                    padding: 0.25rem; /* Reduced padding */
                    border: 1px solid var(--color-border, #e5e7eb);
                    border-radius: 0.25rem;
                    background-color: var(--color-input-bg, #fff);
                    color: var(--color-text, #4b5563);
                    font-size: 0.8rem; /* Smaller input text */
                }

                .procurement-app input::placeholder {
                    font-size: 0.7rem; /* Smaller placeholder text */
                }

                .procurement-app input:focus {
                    outline: none;
                    border-color: var(--color-primary, #4f46e5);
                    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
                }

                .procurement-app tfoot {
                    font-weight: bold;
                    background-color: var(--color-background-alt, rgba(0, 0, 0, 0.03));
                }

                .procurement-app tfoot td {
                    border-top: 2px solid var(--color-border-dark, #d1d5db);
                }

                /* Only keeping the button container styling */
                .procurement-app .button-container {
                    display: flex;
                    gap: 0.5rem; /* Reduced gap */
                    margin-top: 1rem;
                    justify-content: flex-end;
                }

                /* Improved responsive adjustments */
                @media (max-width: 768px) {
                    .procurement-app table {
                        display: block;
                        width: 100%;
                    }

                    .procurement-app thead {
                        display: none;
                    }

                    .procurement-app tbody,
                    .procurement-app tr {
                        display: block;
                        width: 100%;
                    }

                    .procurement-app tr {
                        margin-bottom: 1rem;
                        border: 1px solid var(--color-border, #e5e7eb);
                        border-radius: 0.25rem;
                        padding: 0.5rem;
                    }

                    .procurement-app td {
                        display: flex;
                        padding: 0.5rem 0;
                        border-bottom: 1px solid var(--color-border, #e5e7eb);
                        white-space: normal; /* Allow wrapping in mobile view */
                        width: 100% !important;
                    }

                    .procurement-app td:before {
                        content: attr(data-label);
                        font-weight: bold;
                        width: 40%;
                        margin-right: 0.5rem;
                        font-size: 0.8rem;
                    }

                    /* Fix for tfoot scaling */
                    .procurement-app tfoot {
                        display: block;
                        width: 100%;
                    }

                    .procurement-app tfoot tr {
                        display: flex;
                        width: 100%;
                        border: 1px solid var(--color-border, #e5e7eb);
                        margin-top: 0.5rem;
                        background-color: var(--color-background-alt, rgba(0, 0, 0, 0.03));
                    }

                    .procurement-app tfoot td {
                        flex: 1;
                        text-align: left;
                        padding: 0.75rem 0.5rem;
                    }

                    .procurement-app tfoot td:first-child {
                        font-weight: bold;
                    }

                    /* Reset column widths for mobile */
                    .procurement-app th,
                    .procurement-app td {
                        width: 100% !important;
                    }

                    /* Make button container stack vertically on mobile */
                    .procurement-app .button-container {
                        flex-direction: column;
                        width: 100%;
                    }
                }
            `}</style>

            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Purpose</th>
                        <th>Quantity</th>
                        <th>Vendors</th>
                        <th>A Price</th>
                        <th>B Price</th>
                        <th>Total A</th>
                        <th>Total B</th>
                        <th>Lowest</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            <td data-label="Item">
                                <input
                                    type="text"
                                    value={row.itemName}
                                    onChange={(e) => handleEdit(rowIndex, 'itemName', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="Purpose">
                                <input
                                    type="text"
                                    value={row.purpose}
                                    onChange={(e) => handleEdit(rowIndex, 'purpose', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="Quantity">
                                <input
                                    type="number"
                                    value={row.totalQuantity}
                                    onChange={(e) => handleEdit(rowIndex, 'totalQuantity', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="Vendors">
                                <input
                                    type="text"
                                    value={row.vendorOptions}
                                    onChange={(e) => handleEdit(rowIndex, 'vendorOptions', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="A Price">
                                <input
                                    type="number"
                                    value={row.costVendor1}
                                    onChange={(e) => handleEdit(rowIndex, 'costVendor1', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="B Price">
                                <input
                                    type="number"
                                    value={row.costVendor2}
                                    onChange={(e) => handleEdit(rowIndex, 'costVendor2', (e.target as HTMLInputElement).value)}
                                />
                            </td>
                            <td data-label="Total A">${row.estimatedCostVendor1.toFixed(2)}</td>
                            <td data-label="Total B">${row.estimatedCostVendor2.toFixed(2)}</td>
                            <td data-label="Lowest Cost">${row.lowestFinalCost.toFixed(2)}</td>
                            <td data-label="Action">
                                <button
                                    onClick={() => removeRow(rowIndex)}
                                    className="btn"
                                    aria-label={`Remove row ${rowIndex + 1}`}
                                    title="Remove item"
                                >
                                    <span className="rounded-full px-2 py-1 text-center text-xs text-white bg-red-500 dark:bg-red-600 flex items-center justify-center w-6 h-6">
                                        ✕
                                    </span>
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td colSpan={8} data-label="Total Lowest Cost">Total Lowest Cost:</td>
                        <td data-label="Total Amount">${totalLowestFinalCost.toFixed(2)}</td>
                        <td></td>
                    </tr>
                </tfoot>
            </table>

            {/* Using Tailwind utility classes for the action buttons */}
            <div className="my-6 flex flex-col md:flex-row w-full justify-end space-y-3 md:space-y-0">
                <button
                    onClick={addRow}
                    className="btn w-full justify-center md:w-auto"
                >
                    <span className="rounded-full px-12 py-3 text-center text-sm text-light-text-heading dark:text-white flex items-center justify-center">
                        Add Row
                    </span>
                </button>
                <button
                    onClick={printTable}
                    className="btn w-full justify-center md:w-auto md:ml-4"
                >
                    <span className="rounded-full px-12 py-3 text-center text-sm text-light-text-heading dark:text-white flex items-center justify-center">
                        Print Table
                    </span>
                </button>
            </div>
        </div>
    );
}
