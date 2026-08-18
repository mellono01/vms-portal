'use client'

import React, { useState } from 'react';

import dayjs from 'dayjs';

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Collapse,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';

import {
  HelpOutline,
  HelpOutlined,
  Warning,
} from '@mui/icons-material';

// Store
import { useStore } from '@/lib/providers/storeProvider';

// DTO
import type { Form } from '@/lib/dto/Form.dto';

// Hooks
import { useStatusColour } from '@/app/lib/hooks/useStatusColour';

// Helper functions
import {
  getStatusTooltipText,
  getExpiryDateFormat,
  getCardSubHeaderText,
  getCardAvatar,
} from './helpers';

// Components
import { ClearanceUsage } from './ClearanceUsage';
import { ActionButtons } from './ActionButtons';

interface ClearanceCardMobileProps {
  mode: 'view' | 'edit';
  disableActions: boolean;
  clearance: Form;
  setSelectedForm?: (form: Form) => void;
  setEditDetailsOpen?: (open: boolean) => void;
  setOpenDeleteModal?: (open: boolean) => void;
}

export function ClearanceCardMobile({
  mode,
  disableActions,
  clearance,
  setSelectedForm,
  setEditDetailsOpen,
  setOpenDeleteModal,
}: ClearanceCardMobileProps) {
  const {
    locations,
  } = useStore((store) => store);

  const getCardColor = useStatusColour();
  const cardColour = getCardColor(clearance.FormStatus?.id);
  const [showInfo, setShowInfo] = useState(false);

  const statusLabel = clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_APPLIEDNOC
    ? 'Applied'
    : clearance.FormStatus.Name;

  const expiryText = getExpiryDateFormat(
    clearance.ExpiryDate ? new Date(clearance.ExpiryDate) : null,
    clearance.FormStatus.id,
  );

  const locationNames = clearance.Locations && clearance.Locations.length > 0
    ? clearance.Locations
        .map((locationId) => {
          const locationDetails = locations?.find((location) => location._id === locationId);
          return locationDetails ? `${locationDetails.Name} (${locationDetails.Suburb})` : null;
        })
        .filter((locationName): locationName is string => Boolean(locationName))
    : ['All'];

  return (
    <Card
      elevation={12}
      sx={{
        position: 'relative',
        overflow: 'visible',
        width: '100%',
        maxWidth: '450px',
      }}
    >
      <CardHeader
        title={
          <Typography variant="h6">
            {clearance.FormType.Name.replace(/(?<!^)([A-Z])/g, ' $1')}
          </Typography>
        }
        subheader={getCardSubHeaderText(clearance.FormStatus.id)}
        avatar={getCardAvatar(clearance.FormStatus.id, cardColour)}
        action={
          !disableActions && (
            <Tooltip
              title={'Clearance Help'}
              placement="top"
              slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
            >
              <IconButton
                aria-label="clearance-help"
                onClick={() => setShowInfo((previous) => !previous)}
              >
                <HelpOutlined sx={{ color: showInfo ? 'primary.dark' : 'primary.main' }} />
              </IconButton>
            </Tooltip>
          )
        }
      />

      <Divider sx={{ color: 'darkGrey' }} />

      <Collapse in={showInfo}>
        <ClearanceUsage clearance={clearance} />
      </Collapse>

      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Status:
          </Typography>
          <Chip
            label={
              <Typography variant="body1" sx={{ lineHeight: 1.2 }}>
                {statusLabel}
              </Typography>
            }
            size="small"
            sx={{ backgroundColor: cardColour, color: 'black', height: 24 }}
          />
          <Tooltip
            title={getStatusTooltipText(clearance.FormStatus.id)}
            placement="top"
            slotProps={{ tooltip: { sx: { fontSize: '14px' } } }}
          >
            <HelpOutline color="primary" sx={{ fontSize: '18px' }} />
          </Tooltip>
        </Box>

        {expiryText && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body1" sx={{ minWidth: 58, color: 'text.secondary' }}>
              Expires:
            </Typography>
            <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
              {expiryText}
              {clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING ? (
                <Warning sx={{ fontSize: '18px', color: cardColour, ml: 0.5 }} />
              ) : null}
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 0.5 }}>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
            Locations:
          </Typography>
          {locationNames.map((locationName, locationIndex) => (
            <Typography
              key={`${clearance._id ?? clearance.FormType.id}-location-${locationIndex}`}
              variant="body1"
            >
              {locationName}
            </Typography>
          ))}
        </Box>

        {[
          process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER,
          process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR,
          process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER,
          process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR,
        ].includes(clearance.FormType.id) && (
          <>
            <Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
                WWCC Number:
              </Typography>
              <Typography variant="body1">
                {clearance.WwccNumber ? clearance.WwccNumber : '(none)'}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
                WWCC Expiry:
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center' }}>
                {clearance.WwccExpiryDate ? dayjs(clearance.WwccExpiryDate).format('DD/MM/YYYY') : '(none)'}
                {clearance.FormStatus.id === process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING ? (
                  <Warning sx={{ fontSize: '18px', color: cardColour, ml: 0.5 }} />
                ) : null}
              </Typography>
            </Box>
          </>
        )}

        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
            Phone Number:
          </Typography>
          <Typography variant="body1">{clearance.PhoneNumber ? clearance.PhoneNumber : '(none)'}</Typography>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
            Email:
          </Typography>
          <Typography variant="body1">{clearance.EmailAddress ? clearance.EmailAddress : '(none)'}</Typography>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
            Organisation:
          </Typography>
          <Typography variant="body1">{clearance.OrganisationName ? clearance.OrganisationName : '(none)'}</Typography>
        </Box>

        <Box>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 0.25 }}>
            Organisation ABN:
          </Typography>
          <Typography variant="body1">{clearance.OrganisationAbn ? clearance.OrganisationAbn : '(none)'}</Typography>
        </Box>
      </CardContent>

      {!disableActions &&
        setSelectedForm &&
        setEditDetailsOpen &&
        setOpenDeleteModal && (
          <>
            <Divider sx={{ mt: 1, mb: 1 }} />
            <CardActions>
              <ActionButtons
                clearance={clearance}
                setSelectedForm={setSelectedForm}
                setEditDetailsOpen={setEditDetailsOpen}
                setOpenDeleteModal={setOpenDeleteModal}
              />
            </CardActions>
          </>
        )}
    </Card>
  );
}
