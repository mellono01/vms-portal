
'use client'

import { 
  Box, 
  Typography 
} from "@mui/material";

import { alpha } from '@mui/material/styles';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Helpers
import { getClearanceTypeInfo } from "./helpers";

export function ClearanceUsage({
  clearance
}: {
  clearance: Form
}) {

  const typeInfo = getClearanceTypeInfo(clearance.FormType.id);
  const under18 = clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18;
  
  return (
    <Box sx={{ px: 2, py: 1.5, backgroundColor: 'primary.50', borderBottom: '1px solid', borderColor: 'divider' }}>
      {
        under18 && (
          clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT || 
          clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER
        ) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              This clearance can be used for:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
              <li>
                <Typography variant="body2">
                  All unpaid work while you are under 18 years of age
                </Typography>
              </li>
            </Box>
          </Box>
        )
      }
      {
        under18 && 
        clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER &&
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
          <Typography variant="body2">
            Once you turn 18 you will need to provide a Working With Children Check (WWCC) to continue using this clearance.
          </Typography>
        </Box>
      }
      {
        under18 && (
          clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT ||
          clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR
        ) && (
          <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>
              This clearance can be used for:
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
              <li>
                <Typography variant="body2">
                  All paid work while you are under 18 years of age
                </Typography>
              </li>
            </Box>
          </Box>
        )
      }
      {
        under18 && 
        clearance.FormType.id === process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR &&
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.info.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'info.light' }}>
          <Typography variant="body2">
            Once you turn 18 you will need to provide a Working With Children Check (WWCC) to continue using this clearance.
          </Typography>
        </Box>
      }
      { !under18 && typeInfo.uses.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.success.light, 0.2), borderRadius: 1, border: '1px solid', borderColor: 'success.light' }}>
          <Typography variant="body2" sx={{ fontWeight: 600}}>
            This clearance can be used for:
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: '20px', mb: typeInfo.upgradeNote ? 1 : 0 }}>
            {typeInfo.uses.map((use, i) => (
              <li key={i}><Typography variant="body2">{use}</Typography></li>
            ))}
          </Box>
        </Box>
      )}
      {typeInfo.upgradeNote && (
        <Box sx={{ display: 'flex', flexDirection: 'column', mt: 1, p: 1, backgroundColor: (theme) => alpha(theme.palette.warning.light, 0.3), borderRadius: 1, border: '1px solid', borderColor: 'warning.light' }}>
          <Typography variant="body2" sx={{ fontWeight: 600}}>
            {typeInfo.upgradeNote}
          </Typography>
          {typeInfo.upgradeItems && typeInfo.upgradeItems.length > 0 && (
            <Box component="ul" sx={{ m: 0, mt: 0.5, pl: '20px' }}>
              {typeInfo.upgradeItems.map((item, i) => (
                <li key={i}><Typography variant="body2">{item}</Typography></li>
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
}