import dayjs from "dayjs";

import { 
  Typography 
} from "@mui/material";

import {
  CheckCircle,
  Dangerous,
  Error
} from "@mui/icons-material";

export function getClearanceTypeInfo(
  formTypeId: string
): { 
  uses: string[]; 
  upgradeNote?: string; 
  upgradeItems?: string[] 
} {
  switch (formTypeId) {
    case process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT:
      return {
        uses: [
          'Visits as a parent or close relative of a child attending the school you are visiting', 
          'Visits speaking to children where you do not normally work with children (up to 5 days per year)'
        ],
        upgradeNote: 'Upgrade to a "Volunteer" clearance if you will be:',
        upgradeItems: [
          'Volunteering to attend a camp and stay overnight',
          'Providing personal care to a child with a disability',
          'Volunteering as part of a formal mentoring program (i.e Duke of Edinburgh)',
          'Any other unpaid work that involves contact with children or sensitive information about children'
        ],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT:
      return {
        uses: ['Work as a tradesperson (e.g. plumber, electrician, builder)', 'Building related works (e.g. architect, engineer, planning)', 'Maintenance/Property projects (e.g. lawns, landscaping, tree trimming and removal)'],
        upgradeNote: 'Upgrade to a "Contractor" clearance if you will be:',
        upgradeItems: [
          'Providing cleaning services at a school',
          'Visiting as a children\'s entertainer (e.g. footy coach, clown, musician)',
          'Working as a transport services provider',
          'Any other paid work that involves contact with children or sensitive information about children'
        ]
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER:
      return {
        uses: ['All volunteer (unpaid) visits, including those that require a Working With Children Check (WWCC)'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR:
      return {
        uses: ['All contractor (paid) visits, including those that require a Working With Children Check (WWCC)'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATEVOLUNTEER:
      return {
        uses: ['Volunteer visits by interstate visitors', 'WWCC is verified from your home state'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_INTERSTATECONTRACTOR:
      return {
        uses: ['Contractor visits by interstate contractors', 'WWCC is verified from your home state'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_STAFF:
      return {
        uses: ['Staff access to sites'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_ADHOC:
      return {
        uses: ['Ad-hoc visits to sites'],
      };
    case process.env.NEXT_PUBLIC_FORM_TYPES_ORGANISATIONAPPROVEDPERSON:
      return {
        uses: ['Visits as an organisation-approved person'],
      };
    default:
      return { uses: [] };
  }
}

export function getStatusTooltipText(statusId: string) {
  switch(statusId) {
    case process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED:
    case process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18:
      return 'This clearance is valid and can be used at the locations listed below.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED:
      return 'This clearance is currently being processed by our team. Once completed, you will be notified via email with further information and instructions.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING:
      return 'This clearance is currently being renewed and is waiting review by our team. You will be notified via email with further information and instructions once complete.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS:
      return 'This clearance is currently in progress';
    case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING:
      return 'This clearance will expire soon. You will need to renew this clearance before it expires if you wish to continue using it.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED:
      return 'This clearance has been declined and cannot be used. Please contact us for more information.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED:
      return 'This clearance has been closed and cannot be used. Please contact us for more information.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED:
      return 'This clearance has expired and cannot be used currently. To continue using this clearance, please renew it.';
    case process.env.NEXT_PUBLIC_FORM_STATUS_BARRED:
    case process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED:
    case process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG:
      return 'This clearance cannot be used. Please contact us for more information.';
    default:
      return '';
  }
}

export function getExpiryDateFormat(
  expiryDate: Date | null, 
  statusId: string
): string | null {
  if (
    [
      process.env.NEXT_PUBLIC_FORM_STATUS_BARRED,
      process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED,
      process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED,
      process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
    ].includes(statusId) || expiryDate === null
  ) {
    return null;
  } else {
    return `${dayjs(expiryDate).format('DD/MM/YYYY')}`;
  }
}

export function getCardSubHeaderText(
  statusId: string,
): React.ReactNode {
  if (
    [
      process.env.NEXT_PUBLIC_FORM_STATUS_CLOSED,
      process.env.NEXT_PUBLIC_FORM_STATUS_DECLINED,
      process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRED,
      process.env.NEXT_PUBLIC_FORM_STATUS_INTERIMBARRED,
      process.env.NEXT_PUBLIC_FORM_STATUS_BARRED,
      process.env.NEXT_PUBLIC_FORM_STATUS_CLOSEDBYOCG
    ].includes(statusId)
  ) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary'}}>
        This clearance is not valid and cannot be used
      </Typography>
    );
  }
  
  if (
    [
      process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED,
      process.env.NEXT_PUBLIC_FORM_STATUS_APPLIEDNOC
    ].includes(statusId)
  ) {
    return (
      <Typography variant="body2" sx={{ color: 'text.secondary'}}>
        This clearance is pending review
      </Typography>
    );
  }

  return null;
}

export function getCardAvatar(
  statusId: string,
  cardColour: string
): React.ReactNode {
  if (
    [
      process.env.NEXT_PUBLIC_FORM_STATUS_CLEARED,
      process.env.NEXT_PUBLIC_FORM_STATUS_UNDER18,
      process.env.NEXT_PUBLIC_FORM_STATUS_RENEWING,
      process.env.NEXT_PUBLIC_FORM_STATUS_INPROGRESS
    ].includes(statusId)
  ) {
    return <CheckCircle sx={{ fontSize: '35px', color: cardColour }} />;
  }

  // if (
  //   [
  //     process.env.NEXT_PUBLIC_FORM_STATUS_APPLIED,
  //     process.env.NEXT_PUBLIC_FORM_STATUS_APPLIEDNOC,
  //     process.env.NEXT_PUBLIC_FORM_STATUS_EXPIRING,
  //   ].includes(statusId)
  // ) {
  //   return <Dangerous sx={{ fontSize: '35px', color: cardColour }} />
  // }

  return <Error sx={{ fontSize: '35px', color: cardColour }} />;
}