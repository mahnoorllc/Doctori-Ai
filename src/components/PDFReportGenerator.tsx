import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Download, Mail } from 'lucide-react';
import { PDFService, HealthReportData, ChatSummaryData } from '@/services/pdfService';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PDFReportGeneratorProps {
  sessionData?: any;
  chatMessages?: any[];
  className?: string;
}

export const PDFReportGenerator: React.FC<PDFReportGeneratorProps> = ({
  sessionData,
  chatMessages = [],
  className,
}) => {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [reportType, setReportType] = useState<'health' | 'chat'>('health');
  const [customData, setCustomData] = useState({
    patientName: '',
    symptoms: '',
    recommendations: '',
    urgencyLevel: 'low',
    aiAssessment: '',
  });

  const generateHealthReport = async () => {
    setIsGenerating(true);
    try {
      const reportData: HealthReportData = {
        patientName: customData.patientName || `${user?.user_metadata?.first_name || 'Patient'} ${user?.user_metadata?.last_name || ''}`,
        date: new Date().toLocaleDateString(),
        symptoms: customData.symptoms ? customData.symptoms.split(',').map(s => s.trim()) : [],
        aiAssessment: customData.aiAssessment || 'AI assessment based on reported symptoms and medical knowledge.',
        recommendations: customData.recommendations ? customData.recommendations.split('\n').filter(r => r.trim()) : [
          'Monitor symptoms closely',
          'Stay hydrated and get adequate rest',
          'Consult with a healthcare provider if symptoms persist',
          'Follow up in 7-10 days'
        ],
        urgencyLevel: customData.urgencyLevel,
        doctorRecommendation: sessionData?.specialty_recommendation,
      };

      await PDFService.generateHealthReport(reportData);
      toast.success('Health report generated successfully!');
    } catch (error) {
      console.error('Error generating health report:', error);
      toast.error('Failed to generate health report');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateChatSummary = async () => {
    setIsGenerating(true);
    try {
      const reportData: ChatSummaryData = {
        sessionId: sessionData?.id || 'unknown',
        date: new Date().toLocaleDateString(),
        duration: '15 minutes', // Could be calculated from session data
        messages: chatMessages.map(msg => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: msg.created_at || new Date().toISOString(),
        })),
        summary: sessionData?.title || 'Health consultation chat session with AI assistant',
        keyInsights: [
          'Patient reported specific symptoms',
          'AI provided comprehensive health guidance',
          'Recommendations for follow-up care provided',
          'Educational resources shared'
        ],
      };

      await PDFService.generateChatSummary(reportData);
      toast.success('Chat summary generated successfully!');
    } catch (error) {
      console.error('Error generating chat summary:', error);
      toast.error('Failed to generate chat summary');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerate = async () => {
    if (reportType === 'health') {
      await generateHealthReport();
    } else {
      await generateChatSummary();
    }
  };

  return (
    <div className={className}>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Generate Report
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generate PDF Report</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Report Type Selection */}
            <div className="flex gap-4">
              <Button
                variant={reportType === 'health' ? 'default' : 'outline'}
                onClick={() => setReportType('health')}
                className="flex-1"
              >
                Health Report
              </Button>
              <Button
                variant={reportType === 'chat' ? 'default' : 'outline'}
                onClick={() => setReportType('chat')}
                className="flex-1"
              >
                Chat Summary
              </Button>
            </div>

            {reportType === 'health' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Health Report Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="patientName">Patient Name</Label>
                    <Input
                      id="patientName"
                      value={customData.patientName}
                      onChange={(e) => setCustomData(prev => ({ ...prev, patientName: e.target.value }))}
                      placeholder="Enter patient name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                    <Input
                      id="symptoms"
                      value={customData.symptoms}
                      onChange={(e) => setCustomData(prev => ({ ...prev, symptoms: e.target.value }))}
                      placeholder="e.g., headache, fever, fatigue"
                    />
                  </div>

                  <div>
                    <Label htmlFor="aiAssessment">AI Assessment</Label>
                    <Textarea
                      id="aiAssessment"
                      value={customData.aiAssessment}
                      onChange={(e) => setCustomData(prev => ({ ...prev, aiAssessment: e.target.value }))}
                      placeholder="AI assessment of the symptoms..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="recommendations">Recommendations (one per line)</Label>
                    <Textarea
                      id="recommendations"
                      value={customData.recommendations}
                      onChange={(e) => setCustomData(prev => ({ ...prev, recommendations: e.target.value }))}
                      placeholder="Monitor symptoms closely&#10;Get adequate rest&#10;Consult healthcare provider"
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="urgencyLevel">Urgency Level</Label>
                    <select
                      id="urgencyLevel"
                      value={customData.urgencyLevel}
                      onChange={(e) => setCustomData(prev => ({ ...prev, urgencyLevel: e.target.value }))}
                      className="w-full p-2 border border-input rounded-md"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {reportType === 'chat' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chat Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>Session ID:</strong> {sessionData?.id || 'Current session'}</p>
                    <p><strong>Messages:</strong> {chatMessages.length} messages</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                    <p className="text-sm text-muted-foreground">
                      This will generate a comprehensive summary of your chat session including 
                      key insights, recommendations, and the full conversation transcript.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Generate Button */}
            <div className="flex gap-4">
              <Button 
                onClick={handleGenerate} 
                disabled={isGenerating}
                className="flex-1 gap-2"
              >
                <Download className="h-4 w-4" />
                {isGenerating ? 'Generating...' : `Generate ${reportType === 'health' ? 'Health Report' : 'Chat Summary'}`}
              </Button>
            </div>

            {/* Additional Features */}
            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Additional Features</h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2" disabled>
                  <Mail className="h-4 w-4" />
                  Email Report
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Save to Cloud
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Additional features coming soon: Email delivery, cloud storage, and scheduled reports.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PDFReportGenerator;