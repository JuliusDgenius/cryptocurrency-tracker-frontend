import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Grid,
  FormControl, InputLabel, Select, MenuItem, Checkbox,
  FormControlLabel, Chip, Alert, LinearProgress
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import dashboardService from '../../../api/dashboard';

interface CustomReportGeneratorProps {
  portfolioId: string;
  className?: string;
}

interface ReportOptions {
  reportType: string;
  startDate: Date | null;
  endDate: Date | null;
  includeCharts: boolean;
  includeAssets: boolean;
  includeTransactions: boolean;
  includePerformance: boolean;
  includeRiskAnalysis: boolean;
  format: 'pdf' | 'csv' | 'excel';
  benchmark: string;
}

const CustomReportGenerator: React.FC<CustomReportGeneratorProps> = ({
  portfolioId,
  className
}) => {
  const [reportOptions, setReportOptions] = useState<ReportOptions>({
    reportType: 'comprehensive',
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    endDate: new Date(),
    includeCharts: true,
    includeAssets: true,
    includeTransactions: true,
    includePerformance: true,
    includeRiskAnalysis: true,
    format: 'pdf',
    benchmark: 'BTC'
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const reportTypes = [
    { value: 'comprehensive', label: 'Comprehensive Report' },
    { value: 'performance', label: 'Performance Analysis' },
    { value: 'risk', label: 'Risk Assessment' },
    { value: 'tax', label: 'Tax Report' },
    { value: 'custom', label: 'Custom Report' }
  ];

  const benchmarks = [
    { value: 'BTC', label: 'Bitcoin' },
    { value: 'ETH', label: 'Ethereum' },
    { value: 'SP500', label: 'S&P 500' },
    { value: 'GOLD', label: 'Gold' },
    { value: 'none', label: 'No Benchmark' }
  ];

  const handleOptionChange = (field: keyof ReportOptions, value: any) => {
    setReportOptions(prev => ({
      ...prev,
      [field]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handleGenerateReport = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setSuccess(null);
      setGenerationProgress(0);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return prev;
          }
          return prev + 10;
        });
      }, 200);

      const reportData = await dashboardService.generateCustomReport(
        portfolioId,
        reportOptions
      );
      console.log('Report generated:', reportData);

      clearInterval(progressInterval);
      setGenerationProgress(100);

      // Simulate download
      setTimeout(() => {
        setSuccess(`Report generated successfully! ${reportOptions.format.toUpperCase()} file downloaded.`);
        setIsGenerating(false);
        setGenerationProgress(0);
      }, 1000);

    } catch (err) {
      setError('Failed to generate report. Please try again.');
      setIsGenerating(false);
      setGenerationProgress(0);
    }
  };

  const getSelectedSections = (): string[] => {
    const sections: string[] = [];
    if (reportOptions.includeCharts) sections.push('Charts');
    if (reportOptions.includeAssets) sections.push('Assets');
    if (reportOptions.includeTransactions) sections.push('Transactions');
    if (reportOptions.includePerformance) sections.push('Performance');
    if (reportOptions.includeRiskAnalysis) sections.push('Risk Analysis');
    return sections;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box className={className}>
        <Typography variant="h6" gutterBottom>
          Custom Report Generator
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {isGenerating && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" gutterBottom>
              Generating report... {generationProgress}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={generationProgress}
              sx={{ height: 8, borderRadius: 4 }}
            />
          </Box>
        )}

        <Grid container spacing={3}>
          {/* Report Configuration */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Report Configuration
                </Typography>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Report Type</InputLabel>
                  <Select
                    value={reportOptions.reportType}
                    onChange={(e) => handleOptionChange('reportType', e.target.value)}
                    label="Report Type"
                  >
                    {reportTypes.map((type) => (
                      <MenuItem key={type.value} value={type.value}>
                        {type.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Format</InputLabel>
                  <Select
                    value={reportOptions.format}
                    onChange={(e) => handleOptionChange('format', e.target.value)}
                    label="Format"
                  >
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="csv">CSV</MenuItem>
                    <MenuItem value="excel">Excel</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Benchmark</InputLabel>
                  <Select
                    value={reportOptions.benchmark}
                    onChange={(e) => handleOptionChange('benchmark', e.target.value)}
                    label="Benchmark"
                  >
                    {benchmarks.map((benchmark) => (
                      <MenuItem key={benchmark.value} value={benchmark.value}>
                        {benchmark.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                  <DatePicker
                    label="Start Date"
                    value={reportOptions.startDate}
                    onChange={(date) => handleOptionChange('startDate', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                  <DatePicker
                    label="End Date"
                    value={reportOptions.endDate}
                    onChange={(date) => handleOptionChange('endDate', date)}
                    slotProps={{ textField: { size: 'small', fullWidth: true } }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Report Sections */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Include Sections
                </Typography>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={reportOptions.includeCharts}
                        onChange={(e) => handleOptionChange('includeCharts', e.target.checked)}
                      />
                    }
                    label="Charts & Visualizations"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={reportOptions.includeAssets}
                        onChange={(e) => handleOptionChange('includeAssets', e.target.checked)}
                      />
                    }
                    label="Asset Holdings"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={reportOptions.includeTransactions}
                        onChange={(e) => handleOptionChange('includeTransactions', e.target.checked)}
                      />
                    }
                    label="Transaction History"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={reportOptions.includePerformance}
                        onChange={(e) => handleOptionChange('includePerformance', e.target.checked)}
                      />
                    }
                    label="Performance Metrics"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={reportOptions.includeRiskAnalysis}
                        onChange={(e) => handleOptionChange('includeRiskAnalysis', e.target.checked)}
                      />
                    }
                    label="Risk Analysis"
                  />
                </Box>

                {/* Selected Sections Preview */}
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Selected Sections:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {getSelectedSections().map((section) => (
                      <Chip
                        key={section}
                        label={section}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    ))}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Generate Button */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleGenerateReport}
            disabled={isGenerating || getSelectedSections().length === 0}
            sx={{ minWidth: 200 }}
          >
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </Button>
        </Box>

        {/* Report Preview */}
        <Card sx={{ mt: 3, bgcolor: 'background.default' }}>
          <CardContent>
            <Typography variant="subtitle1" gutterBottom>
              Report Preview
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Your {reportOptions.reportType} report will include data from{' '}
              {reportOptions.startDate?.toLocaleDateString()} to{' '}
              {reportOptions.endDate?.toLocaleDateString()}, formatted as {reportOptions.format.toUpperCase()}.
              {reportOptions.benchmark !== 'none' && (
                <> Benchmark comparison against {benchmarks.find(b => b.value === reportOptions.benchmark)?.label}.</>
              )}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </LocalizationProvider>
  );
};

export default CustomReportGenerator;
