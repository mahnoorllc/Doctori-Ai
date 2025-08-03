import { supabase } from '@/integrations/supabase/client';
import { PDFService, HealthReportData, ChatSummaryData } from './pdfService';

export class PDFStorageService {
  static async uploadPDFToStorage(
    blob: Blob,
    filename: string,
    userId: string,
    sessionId?: string
  ): Promise<string | null> {
    try {
      // Create storage folder structure: user_id/reports/filename
      const filePath = `${userId}/reports/${filename}`;
      
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .upload(filePath, blob, {
          contentType: 'application/pdf',
          upsert: true
        });

      if (error) {
        console.error('Error uploading PDF:', error);
        return null;
      }

      // Get public URL
      const { data: publicData } = supabase.storage
        .from('medical-reports')
        .getPublicUrl(filePath);

      // Save metadata to database
      await supabase
        .from('medical_reports')
        .insert([{
          user_id: userId,
          session_id: sessionId,
          filename: filename,
          file_path: filePath,
          file_url: publicData.publicUrl,
          report_type: filename.includes('health-report') ? 'health_report' : 'chat_summary',
          created_at: new Date().toISOString()
        }]);

      return publicData.publicUrl;
    } catch (error) {
      console.error('Error in uploadPDFToStorage:', error);
      return null;
    }
  }

  static async generateAndStorageHealthReport(
    data: HealthReportData,
    userId: string,
    sessionId?: string
  ): Promise<string | null> {
    try {
      const { blob, filename } = await PDFService.generateHealthReport(data);
      return await this.uploadPDFToStorage(blob, filename, userId, sessionId);
    } catch (error) {
      console.error('Error generating and storing health report:', error);
      return null;
    }
  }

  static async generateAndStoreChatSummary(
    data: ChatSummaryData,
    userId: string,
    sessionId?: string
  ): Promise<string | null> {
    try {
      const { blob, filename } = await PDFService.generateChatSummary(data);
      return await this.uploadPDFToStorage(blob, filename, userId, sessionId);
    } catch (error) {
      console.error('Error generating and storing chat summary:', error);
      return null;
    }
  }

  static async sharePDFWithDoctor(
    pdfUrl: string,
    doctorId: string,
    patientId: string,
    appointmentId?: string
  ): Promise<boolean> {
    try {
      await supabase
        .from('shared_reports')
        .insert([{
          pdf_url: pdfUrl,
          doctor_id: doctorId,
          patient_id: patientId,
          appointment_id: appointmentId,
          shared_at: new Date().toISOString()
        }]);

      return true;
    } catch (error) {
      console.error('Error sharing PDF with doctor:', error);
      return false;
    }
  }

  static async getUserReports(userId: string): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('medical_reports')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching user reports:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getUserReports:', error);
      return [];
    }
  }
}