// This would typically generate PDF certificates
// For now, we'll just create a simple text-based certificate

exports.generateCertificateContent = (certificateData) => {
  const { learnerName, courseTitle, instructorName, issueDate, certificateId } = certificateData;
  
  return `
    CERTIFICATE OF COMPLETION
    =========================
    
    This certifies that
    ${learnerName}
    has successfully completed the course
    "${courseTitle}"
    
    Instructor: ${instructorName}
    Issue Date: ${new Date(issueDate).toLocaleDateString()}
    Certificate ID: ${certificateId}
    
    Verified at: ${process.env.BASE_URL}/api/certificates/verify/${certificateId}
  `;
};