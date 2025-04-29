import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';

const CompletedRequest = ({ request }) => {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      let yPos = 20;
      const margin = 20;
      const lineHeight = 7;
      const pageWidth = doc.internal.pageSize.getWidth();

      // Title
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle Repair Report', pageWidth / 2, yPos, { align: 'center' });
      yPos += 15;

      // Date
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Generated: ${formatDate(new Date())}`, pageWidth - margin, yPos, { align: 'right' });
      yPos += 15;

      // Vehicle Info
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Vehicle Information', margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Make: ${request.vehicle?.make || 'N/A'}`, margin, yPos);
      yPos += lineHeight;
      doc.text(`Model: ${request.vehicle?.model || 'N/A'}`, margin, yPos);
      yPos += lineHeight;
      doc.text(`Registration: ${request.vehicle?.registrationNumber || 'N/A'}`, margin, yPos);
      yPos += 15;

      // Repair Info
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Repair Information', margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      
      const descriptionLines = doc.splitTextToSize(`Description: ${request.description}`, pageWidth - (2 * margin));
      doc.text(descriptionLines, margin, yPos);
      yPos += (descriptionLines.length * lineHeight) + 5;

      doc.text(`Completion Date: ${formatDate(request.completedAt)}`, margin, yPos);
      yPos += lineHeight;
      doc.text(`Total Cost: $${request.totalCost}`, margin, yPos);
      yPos += 15;

      // Parts Table
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Parts Used', margin, yPos);
      yPos += 10;

      // Table Headers
      doc.setFontSize(12);
      const col1 = margin;
      const col2 = margin + 80;
      const col3 = margin + 120;

      doc.line(margin, yPos + 2, pageWidth - margin, yPos + 2);
      doc.text('Part Name', col1, yPos);
      doc.text('Quantity', col2, yPos);
      doc.text('Cost', col3, yPos);
      yPos += 8;

      // Table Content
      doc.setFont('helvetica', 'normal');
      request.usedParts.forEach(part => {
        if (yPos > 250) {
          doc.addPage();
          yPos = 20;
        }
        
        doc.text(part.partId.name, col1, yPos);
        doc.text(part.quantity.toString(), col2, yPos);
        doc.text(`$${part.cost}`, col3, yPos);
        yPos += lineHeight;
      });
      yPos += 15;

      // Repair Notes
      if (yPos > 220) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Repair Notes', margin, yPos);
      yPos += 10;

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      const notesLines = doc.splitTextToSize(request.repairNotes, pageWidth - (2 * margin));
      doc.text(notesLines, margin, yPos);

      // Add page numbers
      const pageCount = doc.internal.getNumberOfPages();
      for(let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
      }

      // Save PDF
      doc.save(`Repair_Request_${request._id}.pdf`);
      toast.success('Report generated successfully');
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast.error('Failed to generate report');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Vehicle: {request.vehicle?.make || 'N/A'} {request.vehicle?.model || 'N/A'}
          </h2>
          <p className="text-gray-600">
            Registration: {request.vehicle?.registrationNumber || 'N/A'}
          </p>
        </div>
        <button
          onClick={generatePDF}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ease-in-out"
        >
          Generate Report
        </button>
      </div>

      <p className="text-gray-700 mt-2">Description: {request.description}</p>
      <p className="text-gray-600">Completed At: {formatDate(request.completedAt)}</p>
      <p className="text-gray-600">Total Cost: ${request.totalCost}</p>
      
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Used Parts:</h3>
        <div className="grid gap-2">
          {request.usedParts.map((part, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span>{part.partId.name}</span>
              <span>Quantity: {part.quantity}</span>
              <span>Cost: ${part.cost}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <h3 className="font-semibold mb-2">Repair Notes:</h3>
        <p className="text-gray-700">{request.repairNotes}</p>
      </div>
    </div>
  );
};

const CompletedRequests = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompletedRequests = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please log in to view requests');
        navigate('/login');
        return;
      }

      const response = await axios.get(
        'http://localhost:4000/api/damage-requests/my-completed',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching completed requests:', error);
      toast.error('Failed to load completed requests');
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCompletedRequests();
  }, [fetchCompletedRequests]);

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Completed Requests</h1>

      {requests.length === 0 ? (
        <p className="text-center text-gray-600">No completed requests found.</p>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <CompletedRequest
              key={request._id}
              request={request}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedRequests;
