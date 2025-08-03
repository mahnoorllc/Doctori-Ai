import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { supabase } from '@/integrations/supabase/client';

export interface HealthReportData {
  patientName: string;
  date: string;
  symptoms: string[];
  aiAssessment: string;
  recommendations: string[];
  urgencyLevel: string;
  doctorRecommendation?: string;
  medications?: string[];
  followUpDate?: string;
}

export interface ChatSummaryData {
  sessionId: string;
  date: string;
  duration: string;
  messages: Array<{
    role: 'user' | 'assistant';
    content: string;
    timestamp: string;
  }>;
  summary: string;
  keyInsights: string[];
}

export class PDFService {
  static async generateHealthReport(data: HealthReportData): Promise<{ blob: Blob; filename: string }> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Health Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Patient Info
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Patient: ${data.patientName}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Date: ${data.date}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Urgency Level: ${data.urgencyLevel.toUpperCase()}`, margin, yPosition);
    yPosition += 20;

    // Symptoms
    pdf.setFont(undefined, 'bold');
    pdf.text('Reported Symptoms:', margin, yPosition);
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    data.symptoms.forEach((symptom, index) => {
      pdf.text(`• ${symptom}`, margin + 5, yPosition);
      yPosition += 8;
    });
    yPosition += 10;

    // AI Assessment
    pdf.setFont(undefined, 'bold');
    pdf.text('AI Assessment:', margin, yPosition);
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    const assessmentLines = pdf.splitTextToSize(data.aiAssessment, pageWidth - 2 * margin);
    pdf.text(assessmentLines, margin, yPosition);
    yPosition += assessmentLines.length * 6 + 10;

    // Recommendations
    pdf.setFont(undefined, 'bold');
    pdf.text('Recommendations:', margin, yPosition);
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    data.recommendations.forEach((rec, index) => {
      const recLines = pdf.splitTextToSize(`${index + 1}. ${rec}`, pageWidth - 2 * margin - 10);
      pdf.text(recLines, margin + 5, yPosition);
      yPosition += recLines.length * 6 + 5;
    });

    // Doctor Recommendation (if available)
    if (data.doctorRecommendation) {
      yPosition += 10;
      pdf.setFont(undefined, 'bold');
      pdf.text('Doctor Recommendation:', margin, yPosition);
      yPosition += 10;
      pdf.setFont(undefined, 'normal');
      const docRecLines = pdf.splitTextToSize(data.doctorRecommendation, pageWidth - 2 * margin);
      pdf.text(docRecLines, margin, yPosition);
      yPosition += docRecLines.length * 6;
    }

    // Medical Disclaimer Footer
    const footerY = pdf.internal.pageSize.getHeight() - 30;
    pdf.setFontSize(10);
    pdf.setTextColor(255, 0, 0); // Red color
    pdf.setFont(undefined, 'bold');
    pdf.text('ℹ️ Medical Disclaimer: This AI provides general health information only and is not', 
             pageWidth / 2, footerY - 10, { align: 'center' });
    pdf.text('a substitute for professional medical advice, diagnosis, or treatment. Always consult', 
             pageWidth / 2, footerY, { align: 'center' });
    pdf.text('with a qualified healthcare provider for personal health concerns.', 
             pageWidth / 2, footerY + 10, { align: 'center' });

    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    const filename = `health-report-${data.date}.pdf`;
    
    // Save locally
    pdf.save(filename);
    
    return { blob: pdfBlob, filename };
  }

  static async generateChatSummary(data: ChatSummaryData): Promise<{ blob: Blob; filename: string }> {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 20;
    let yPosition = margin;

    // Header
    pdf.setFontSize(20);
    pdf.setFont(undefined, 'bold');
    pdf.text('Chat Session Summary', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 20;

    // Session Info
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Session ID: ${data.sessionId}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Date: ${data.date}`, margin, yPosition);
    yPosition += 10;
    pdf.text(`Duration: ${data.duration}`, margin, yPosition);
    yPosition += 20;

    // Summary
    pdf.setFont(undefined, 'bold');
    pdf.text('Session Summary:', margin, yPosition);
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    const summaryLines = pdf.splitTextToSize(data.summary, pageWidth - 2 * margin);
    pdf.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 6 + 15;

    // Key Insights
    pdf.setFont(undefined, 'bold');
    pdf.text('Key Insights:', margin, yPosition);
    yPosition += 10;
    pdf.setFont(undefined, 'normal');
    data.keyInsights.forEach((insight, index) => {
      const insightLines = pdf.splitTextToSize(`• ${insight}`, pageWidth - 2 * margin - 5);
      pdf.text(insightLines, margin + 5, yPosition);
      yPosition += insightLines.length * 6 + 5;
    });

    // Check if we need a new page for messages
    if (yPosition > pdf.internal.pageSize.getHeight() - 100) {
      pdf.addPage();
      yPosition = margin;
    }

    // Chat Messages (last 10 messages)
    yPosition += 10;
    pdf.setFont(undefined, 'bold');
    pdf.text('Recent Messages:', margin, yPosition);
    yPosition += 10;

    const recentMessages = data.messages.slice(-10);
    recentMessages.forEach((message, index) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
        pdf.addPage();
        yPosition = margin;
      }

      pdf.setFont(undefined, 'bold');
      pdf.text(`${message.role === 'user' ? 'You' : 'AI Assistant'}:`, margin, yPosition);
      yPosition += 8;
      
      pdf.setFont(undefined, 'normal');
      const messageLines = pdf.splitTextToSize(message.content, pageWidth - 2 * margin);
      pdf.text(messageLines, margin, yPosition);
      yPosition += messageLines.length * 6 + 10;
    });

    // Medical Disclaimer Footer
    const footerY = pdf.internal.pageSize.getHeight() - 30;
    pdf.setFontSize(10);
    pdf.setTextColor(255, 0, 0); // Red color
    pdf.setFont(undefined, 'bold');
    pdf.text('ℹ️ Medical Disclaimer: This AI provides general health information only and is not', 
             pageWidth / 2, footerY - 10, { align: 'center' });
    pdf.text('a substitute for professional medical advice, diagnosis, or treatment. Always consult', 
             pageWidth / 2, footerY, { align: 'center' });
    pdf.text('with a qualified healthcare provider for personal health concerns.', 
             pageWidth / 2, footerY + 10, { align: 'center' });
    
    // Generate PDF blob
    const pdfBlob = pdf.output('blob');
    const filename = `chat-summary-${data.date}.pdf`;
    
    // Save locally
    pdf.save(filename);
    
    return { blob: pdfBlob, filename };
  }

  static async generateFromElement(elementId: string, filename: string): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found');
    }

    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF();
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);
  }
}

export default PDFService;