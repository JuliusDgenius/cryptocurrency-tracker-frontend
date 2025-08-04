import React, { useState } from 'react';
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography
} from '@mui/material';
import {
  FileUpload,
  Download,
  Description,
  TableChart,
} from '@mui/icons-material';
import { CsvImportDialog } from './CsvImportDialog';
import { CsvExportDialog } from './CsvExportDialog';

interface CsvManagementProps {
  portfolioId: string;
  onImportSuccess: () => void;
}

const CsvManagement: React.FC<CsvManagementProps> = ({
  portfolioId,
  onImportSuccess
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleImportClick = () => {
    handleMenuClose();
    setIsImportOpen(true);
  };

  const handleExportClick = () => {
    handleMenuClose();
    setIsExportOpen(true);
  };

  const handleImportSuccess = () => {
    onImportSuccess();
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1 }}>
        {/* Import Button */}
        <Button
          variant="outlined"
          startIcon={<FileUpload />}
          onClick={handleImportClick}
          size="small"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'primary.dark'
            }
          }}
        >
          Import CSV
        </Button>

        {/* Export Menu Button */}
        <Button
          variant="outlined"
          startIcon={<Download />}
          onClick={handleMenuClick}
          size="small"
          sx={{
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              backgroundColor: 'primary.light',
              color: 'primary.dark'
            }
          }}
        >
          Export
        </Button>
      </Box>

      {/* Export Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleExportClick}>
          <ListItemIcon>
            <Description fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Portfolio Data</Typography>
            <Typography variant="caption" color="text.secondary">
              Complete portfolio with assets and transactions
            </Typography>
          </ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleExportClick}>
          <ListItemIcon>
            <TableChart fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Transactions Only</Typography>
            <Typography variant="caption" color="text.secondary">
              Transaction history with detailed records
            </Typography>
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* CSV Import Dialog */}
      <CsvImportDialog
        open={isImportOpen}
        onClose={() => setIsImportOpen(false)}
        portfolioId={portfolioId}
        onImportSuccess={handleImportSuccess}
      />

      {/* CSV Export Dialog */}
      <CsvExportDialog
        open={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        portfolioId={portfolioId}
      />
    </>
  );
};

export { CsvManagement }; 