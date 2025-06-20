import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import * as XLSX from 'xlsx';

const DriverSalary = ({ driverId }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyEarnings, setMonthlyEarnings] = useState({});
  const [startDate, setStartDate] = useState(format(startOfMonth(new Date()), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(format(endOfMonth(new Date()), 'yyyy-MM-dd'));
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/reservation/driver/${driverId}`);
        
        if (response.data.success) {
          // Filter only completed reservations
          const completedReservations = response.data.reservations.filter(
            res => res.status === 'completed' && res.tripStatus === 'trip_finished'
          );
          setReservations(completedReservations);

          // Calculate total earnings (25% of total price)
          const total = completedReservations.reduce((sum, res) => {
            return sum + (parseFloat(res.price) * 0.25);
          }, 0);
          setTotalEarnings(total);

          // Calculate monthly earnings
          const monthly = completedReservations.reduce((acc, res) => {
            const month = format(new Date(res.startDate), 'MMMM yyyy');
            const amount = parseFloat(res.price) * 0.25;
            acc[month] = (acc[month] || 0) + amount;
            return acc;
          }, {});
          setMonthlyEarnings(monthly);
        } else {
          setError('Failed to fetch reservations');
        }
      } catch (err) {
        console.error('Error fetching reservations:', err);
        setError(err.response?.data?.message || 'Failed to fetch reservations');
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [driverId]);

  useEffect(() => {
    // Filter reservations for the selected date range
    const filteredReservations = reservations.filter(res => {
      const reservationDate = parseISO(res.startDate);
      return reservationDate >= parseISO(startDate) && reservationDate <= parseISO(endDate);
    });

    // Prepare report data
    const report = filteredReservations.map(res => ({
      Date: format(new Date(res.startDate), 'MMM dd, yyyy'),
      Customer: res.name,
      Email: res.email,
      'Trip Duration': `${res.wantedtime} hours`,
      'Total Amount': `Rs. ${parseFloat(res.price).toFixed(2)}`,
      'Your Earnings (25%)': `Rs. ${(parseFloat(res.price) * 0.25).toFixed(2)}`,
      Status: res.status,
      'Trip Status': res.tripStatus
    }));

    setReportData(report);
  }, [reservations, startDate, endDate]);

  const handleDownloadExcel = () => {
    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(reportData);
    
    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Salary Report');
    
    // Generate Excel file
    XLSX.writeFile(wb, `salary_report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  const handleDownloadPDF = () => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    
    // Create the HTML content for the PDF
    const content = `
      <html>
        <head>
          <title>Salary Report</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 20px; }
            .summary { margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Salary Report</h1>
            <p>Period: ${format(new Date(startDate), 'MMM dd, yyyy')} - ${format(new Date(endDate), 'MMM dd, yyyy')}</p>
          </div>
          <div class="summary">
            <h3>Summary</h3>
            <p>Total Earnings: Rs. ${reportData.reduce((sum, row) => 
              sum + parseFloat(row['Your Earnings (25%)'].replace('Rs. ', '')), 0).toFixed(2)}</p>
            <p>Number of Trips: ${reportData.length}</p>
          </div>
          <table>
            <thead>
              <tr>
                ${Object.keys(reportData[0] || {}).map(key => `<th>${key}</th>`).join('')}
              </tr>
            </thead>
            <tbody>
              ${reportData.map(row => `
                <tr>
                  ${Object.values(row).map(value => `<td>${value}</td>`).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;
    
    // Write the content to the new window
    printWindow.document.write(content);
    printWindow.document.close();
    
    // Wait for content to load then print
    printWindow.onload = function() {
      printWindow.print();
      printWindow.close();
    };
  };

  if (loading) return <div className="flex justify-center items-center h-32">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Salary Details</h2>
      
      {/* Report Generation Section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Generate Salary Report</h3>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={handleDownloadExcel}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <FaDownload className="mr-2" />
            Download Excel
          </button>
          <button
            onClick={handleDownloadPDF}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FaFilePdf className="mr-2" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Total Earnings Card */}
      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-2">Total Earnings</h3>
        <p className="text-3xl font-bold text-blue-700">Rs. {totalEarnings.toFixed(2)}</p>
        <p className="text-sm text-blue-600 mt-2">Based on 25% of completed trips</p>
      </div>

      {/* Monthly Breakdown */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(monthlyEarnings).map(([month, amount]) => (
            <div key={month} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-700">{month}</span>
              <span className="font-semibold text-gray-900">Rs. {amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Completed Reservations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Completed Trips</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Earnings (25%)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {reservations.slice(0, 5).map((reservation) => (
                <tr key={reservation._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(reservation.startDate), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{reservation.name}</div>
                    <div className="text-sm text-gray-500">{reservation.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    Rs. {parseFloat(reservation.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-600 font-medium">
                    Rs. {(parseFloat(reservation.price) * 0.25).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverSalary; 